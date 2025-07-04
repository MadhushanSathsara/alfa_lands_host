import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Ensure this path is correct
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for images
import './Agent1.css'; // Assuming your CSS file contains your styling

// Custom Modal component for Confirm/Alert messages
const CustomAlertDialog = ({ message, onConfirm, onCancel, showConfirm = true }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    {showConfirm && <button onClick={onConfirm} className="modal-button confirm">Yes</button>}
                    <button onClick={onCancel} className="modal-button cancel">{showConfirm ? 'No' : 'Close'}</button>
                </div>
            </div>
        </div>
    );
};

const teamList = ['All', 'Agent', 'Inspector', 'Supervise Team', 'Executive Team', 'Marketing Team'];
const posList = ['All', 'Senior', 'Junior'];

// Supabase Storage Bucket details
// IMPORTANT: Replace 'hddobdmhmzmmdqtmktse' with YOUR actual Supabase Project Reference
// You should typically use environment variables for this in a real project
const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse'; // <<< VERIFY THIS!
const SUPABASE_BUCKET_NAME = 'agentimages'; // Your Supabase Storage bucket name for agents
const supabaseStorageUrl = `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/`;


const Agent = () => {
    const [agents, setAgents] = useState([]);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [team, setTeam] = useState('All');
    const [pos, setPos] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    // State for custom alerts/confirms
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState(null);
    const [isConfirmation, setIsConfirmation] = useState(false);

    // --- Custom Alert/Confirm Functions (replacing window.confirm/alert) ---
    const showCustomAlert = (message, isConfirm = false, onConfirm = null) => {
        setAlertMessage(message);
        setIsConfirmation(isConfirm);
        setOnConfirmAction(() => onConfirm); // Use a functional update to store the callback
        setShowAlert(true);
    };

    const hideCustomAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
        setIsConfirmation(false);
        setOnConfirmAction(null);
    };

    const handleAlertConfirm = () => {
        if (onConfirmAction) {
            onConfirmAction();
        }
        hideCustomAlert();
    };
    // --- END Custom Alert/Confirm Functions ---


    const fetchAgents = async () => {
        setLoading(true); // Start loading
        setError(null);    // Clear previous errors
        try {
            const { data, error } = await supabase
                .from('agents')
                .select('*')
                .order('agent_id', { ascending: true }); // Ensure consistent ordering

            if (error) {
                console.error('Supabase fetch error:', error.message);
                throw error;
            }

            if (Array.isArray(data)) {
                setAgents(data);
                setFiltered(data); // Initialize filtered with all agents
            } else {
                setAgents([]);
                setFiltered([]);
            }
        } catch (err) {
            console.error('Error fetching agents from Supabase:', err.message);
            setError('Failed to load agents. Please check your network and RLS policies.');
            showCustomAlert('Failed to load agents. Please check your network and RLS policies.', false);
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    // Filter agents whenever search, team, position, or agents data changes
    useEffect(() => {
        const filteredAgents = agents.filter(agent => {
            const nameMatch = (agent.agent_name || '').toLowerCase().includes(search.toLowerCase());
            const emailMatch = (agent.agent_email || '').toLowerCase().includes(search.toLowerCase());
            const teamMatch = team === 'All' || agent.agent_team === team;
            const posMatch = pos === 'All' || agent.agent_position === pos;
            return (nameMatch || emailMatch) && teamMatch && posMatch;
        });
        setFiltered(filteredAgents);
    }, [search, team, pos, agents]);

    const handleEdit = (agent) => {
        // When editing, selectedAgent.agent_image will hold the filename (e.g., "uuid.jpg")
        setSelectedAgent({ ...agent, newImage: null }); // newImage will store the File object if chosen
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!selectedAgent) return;

        let imageUrlToSave = selectedAgent.agent_image; // Keep existing image by default
        let oldImageFileName = selectedAgent.agent_image; // To delete old image if new one is uploaded

        try {
            // 1. Upload new image if selected
            if (selectedAgent.newImage) {
                const file = selectedAgent.newImage;
                const fileExtension = file.name.split('.').pop();
                const uniqueFileName = `${uuidv4()}.${fileExtension}`; // Generate unique filename
                const filePath = `${uniqueFileName}`; // Store in the root of agentimages bucket

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(SUPABASE_BUCKET_NAME)
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false, // Do not upsert; uuidv4 makes it unique, so no overwrite
                    });

                if (uploadError) throw uploadError;
                imageUrlToSave = uniqueFileName; // Update the image filename to be stored in the DB

                // 2. Delete old image from Supabase Storage if a new one was uploaded and old one existed
                if (oldImageFileName && oldImageFileName !== 'default.jpg' && oldImageFileName !== 'no-image.jpg') { // Add checks for default/placeholder images
                    const { error: removeError } = await supabase.storage
                        .from(SUPABASE_BUCKET_NAME)
                        .remove([oldImageFileName]);

                    if (removeError) {
                        console.warn("Warning: Old image deletion failed:", removeError.message);
                        // Do not block save, just log the warning
                    } else {
                        console.log(`Successfully deleted old image ${oldImageFileName}`);
                    }
                }
            }

            // 3. Prepare update data
            const updateData = {
                agent_name: selectedAgent.agent_name,
                agent_email: selectedAgent.agent_email,
                agent_username: selectedAgent.agent_username,
                // WARNING: Directly updating password without hashing here is INSECURE.
                // This is done as per your specific request "dont use hashed".
                // In a real application, you would handle passwords securely (e.g., via auth.updateUser, or backend hashing).
                agent_password: selectedAgent.agent_password,
                agent_position: selectedAgent.agent_position,
                agent_team: selectedAgent.agent_team,
                agent_telephone: selectedAgent.agent_telephone,
                agent_image: imageUrlToSave, // Save the filename (or null)
            };

            // 4. Update agent record in the database
            const { error } = await supabase
                .from('agents')
                .update(updateData)
                .eq('agent_id', selectedAgent.agent_id);

            if (error) throw error;

            showCustomAlert('Agent updated successfully!', false);
            setShowModal(false);
            fetchAgents(); // Re-fetch all agents to ensure UI is up-to-date
        } catch (error) {
            console.error('Save error:', error.message);
            showCustomAlert(`Failed to save agent: ${error.message}`, false);
        }
    };

    const handleDelete = (agentId, agentImageFileName) => {
        showCustomAlert("Are you sure you want to delete this agent?", true, async () => {
            try {
                // 1. Delete image from Supabase Storage (if agent_image exists and is not a default/placeholder)
                if (agentImageFileName && agentImageFileName !== 'default.jpg' && agentImageFileName !== 'no-image.jpg') {
                    const { error: removeError } = await supabase.storage
                        .from(SUPABASE_BUCKET_NAME)
                        .remove([agentImageFileName]); // Pass the filename

                    if (removeError) {
                        console.error("Error deleting agent image from storage:", removeError.message);
                        // Don't throw, try to delete the agent record anyway, just log the error.
                        showCustomAlert(`Warning: Image deletion failed: ${removeError.message}. Proceeding to delete agent record.`, false);
                    } else {
                        console.log(`Successfully deleted image ${agentImageFileName}`);
                    }
                }

                // 2. Delete agent record from the database
                const { error: dbError } = await supabase
                    .from('agents')
                    .delete()
                    .eq('agent_id', agentId);

                if (dbError) throw dbError;

                showCustomAlert("Agent deleted successfully!", false);
                // Optimistically update UI
                setAgents(prev => prev.filter(agent => agent.agent_id !== agentId));
                setFiltered(prev => prev.filter(agent => agent.agent_id !== agentId));
            } catch (err) {
                console.error("Delete agent error:", err.message);
                showCustomAlert(`Error deleting agent: ${err.message}`, false);
            }
        });
    };

    if (loading) {
        return <div className="ag-wrap"><p>Loading agents...</p></div>;
    }

    if (error) {
        return <div className="ag-wrap"><p className="error-message">Error: {error}</p></div>;
    }

    return (
        <div className="ag-wrap">
            <h1>Agent List</h1>

            <div className="ag-filters">
                <input
                    type="text"
                    placeholder="Search name/email"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <h3>Team</h3>
                <select value={team} onChange={e => setTeam(e.target.value)}>
                    {teamList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <h3>Position</h3>
                <select value={pos} onChange={e => setPos(e.target.value)}>
                    {posList.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            <div className="ag-add">
                <Link to="/admin_dashboard/AddAgent">
                    <button>+ Add Agent</button>
                </Link>
            </div>

            <div className="ag-cards">
                {filtered.length === 0 ? (
                    <p className="text-center col-span-full">No agents found matching your criteria.</p>
                ) : (
                    filtered.map((agent) => (
                        <div key={agent.agent_id} className="ag-card">
                            <img
                                // Construct the public URL for the agent's image
                                src={agent.agent_image ? `${supabaseStorageUrl}${agent.agent_image}` : `https://placehold.co/100x100?text=No+Image`}
                                alt={agent.agent_name || 'Agent Image'}
                                className="ag-img"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100?text=Image+Error"; }}
                            />
                            <h3>{agent.agent_name}</h3>
                            <p><b>ID:</b> {agent.agent_id}</p>
                            <p><b>Email:</b> {agent.agent_email}</p>
                            <p><b>Phone:</b> {agent.agent_telephone || 'N/A'}</p>
                            <p><b>Position:</b> {agent.agent_position}</p>
                            <p><b>Team:</b> {agent.agent_team}</p>
                            <button onClick={() => handleEdit(agent)} className="edit-btn">Edit</button>
                            <button onClick={() => handleDelete(agent.agent_id, agent.agent_image)} className="delete-btn">Delete</button>
                        </div>
                    ))
                )}
            </div>

            {showModal && selectedAgent && (
                <div className="ag-modal-bg" onClick={() => setShowModal(false)}>
                    <div className="ag-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ag-modal-header">
                            <h2>Edit Agent</h2>
                            <button className="ag-close" onClick={() => setShowModal(false)}>✖</button>
                        </div>
                        <h6>Name</h6>
                        <input type="text" value={selectedAgent.agent_name || ''} onChange={e => setSelectedAgent({ ...selectedAgent, agent_name: e.target.value })} />
                        <h6>Email</h6>
                        <input type="email" value={selectedAgent.agent_email || ''} onChange={e => setSelectedAgent({ ...selectedAgent, agent_email: e.target.value })} />
                        <h6>Username</h6>
                        <input type="text" value={selectedAgent.agent_username || ''} onChange={e => setSelectedAgent({ ...selectedAgent, agent_username: e.target.value })} />
                        <h6>Password</h6>
                        {/* WARNING: This directly exposes the password from the input.
                            For production, implement secure password management (e.g., hashing on backend, separate password change flow).
                            This is done to meet the explicit request "dont use hashed".
                        */}
                        <input type="text" value={selectedAgent.agent_password || ''} onChange={e => setSelectedAgent({ ...selectedAgent, agent_password: e.target.value })} />
                        <h6>Position</h6>
                        <select value={selectedAgent.agent_position || ''} onChange={e => setSelectedAgent({ ...selectedAgent, agent_position: e.target.value })}>
                            {/* slice(1) to exclude 'All' from edit options */}
                            {posList.slice(1).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <h6>Team</h6>
                        <select value={selectedAgent.agent_team || ''} onChange={e => setSelectedAgent({ ...selectedAgent, agent_team: e.target.value })}>
                            {/* slice(1) to exclude 'All' from edit options */}
                            {teamList.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <h6>Phone Number</h6>
                        <input type="text" value={selectedAgent.agent_telephone || ''} onChange={e => setSelectedAgent({ ...selectedAgent, agent_telephone: e.target.value })} />
                        <h6>Picture</h6>
                        <input type="file" accept="image/*" onChange={e => setSelectedAgent({ ...selectedAgent, newImage: e.target.files[0] })} />
                        {selectedAgent.agent_image && !selectedAgent.newImage && (
                            <div style={{ marginTop: '10px' }}>
                                Current Image: <br/>
                                <img
                                    src={`${supabaseStorageUrl}${selectedAgent.agent_image}`}
                                    alt="Current Agent"
                                    style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100?text=Image+Error"; }}
                                />
                            </div>
                        )}
                        {selectedAgent.newImage && (
                            <div style={{ marginTop: '10px' }}>
                                New Image Preview: <br/>
                                <img
                                    src={URL.createObjectURL(selectedAgent.newImage)}
                                    alt="New Agent Preview"
                                    style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%' }}
                                />
                            </div>
                        )}
                        <button className="save-btn" onClick={handleSave}>Save Changes</button>
                    </div>
                </div>
            )}

            {/* Custom Alert/Confirm Modal */}
            {showAlert && (
                <CustomAlertDialog
                    message={alertMessage}
                    onConfirm={handleAlertConfirm}
                    onCancel={hideCustomAlert}
                    showConfirm={isConfirmation}
                />
            )}
        </div>
    );
};

export default Agent;