import React, { useState } from 'react';
import { supabase } from '../../supabaseClient'; // Ensure this path is correct for your project
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for image filenames
import './AddAgentForm.css'; // Assuming this CSS file contains your styling

const teamList = ['Agent', 'Inspector', 'Supervise Team', 'Executive Team', 'Marketing Team'];
const posList = ['Senior', 'Junior'];

// Supabase Storage Bucket details
// IMPORTANT: Replace 'hddobdmhmzmmdqtmktse' with YOUR actual Supabase Project Reference
const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse'; // <<< VERIFY THIS!
const SUPABASE_BUCKET_NAME = 'agentimages'; // Your Supabase Storage bucket name for agents

const AddAgentForm = () => {
    const [formData, setFormData] = useState({
        agent_name: '',
        agent_email: '',
        agent_telephone: '',
        agent_address: '',
        agent_position: '',
        agent_team: '',
        agent_username: '',
        agent_password: '',
        agent_image: null, // This will hold the File object
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(''); // For showing success/error messages

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            agent_image: e.target.files[0], // Store the File object
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        let imageUrlToSave = null; // This will store the filename to be saved in the database

        try {
            // 1. Upload image to Supabase Storage if a file is selected
            if (formData.agent_image) {
                const file = formData.agent_image;
                const fileExtension = file.name.split('.').pop();
                const uniqueFileName = `${uuidv4()}.${fileExtension}`; // Generate a unique filename
                const filePath = `${uniqueFileName}`; // Path inside the bucket (e.g., 'your-unique-file.jpg')

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(SUPABASE_BUCKET_NAME)
                    .upload(filePath, file, {
                        cacheControl: '3600', // Cache for 1 hour
                        upsert: false, // Don't upsert; we're adding new, unique files
                    });

                if (uploadError) {
                    console.error('Supabase Storage Upload Error:', uploadError.message);
                    throw new Error(`Failed to upload image: ${uploadError.message}`);
                }
                imageUrlToSave = uniqueFileName; // Save the unique filename to be stored in the DB
            }

            // 2. Insert agent data into Supabase database
            const { error: dbError } = await supabase.from('agents').insert([
                {
                    agent_name: formData.agent_name,
                    agent_email: formData.agent_email,
                    agent_telephone: formData.agent_telephone,
                    agent_address: formData.agent_address,
                    agent_position: formData.agent_position,
                    agent_team: formData.agent_team,
                    agent_username: formData.agent_username,
                    agent_password: formData.agent_password, // For production, hash passwords on the backend!
                    agent_image: imageUrlToSave, // Store the unique filename (or null)
                },
            ]);

            if (dbError) {
                console.error('Supabase Database Insert Error:', dbError.message);
                throw new Error(`Failed to add agent to database: ${dbError.message}`);
            }

            setMessage('Agent added successfully!');
            // Reset form after successful submission
            setFormData({
                agent_name: '',
                agent_email: '',
                agent_telephone: '',
                agent_address: '',
                agent_position: '',
                agent_team: '',
                agent_username: '',
                agent_password: '',
                agent_image: null,
            });
            // Clear file input manually
            if (document.getElementById('agent-image-input')) {
                document.getElementById('agent-image-input').value = '';
            }

        } catch (err) {
            console.error('Error adding agent:', err);
            setMessage(`Error: ${err.message || 'Failed to add agent. Please check your network and RLS policies.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agent-form-container">
            <h2>Add New Agent</h2>
            {loading && <p>Adding agent...</p>}
            {message && <p className={message.startsWith('Error') ? 'error-message' : 'success-message'}>{message}</p>}
            <form onSubmit={handleSubmit} className="agent-form">
                <div className="agent-form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="agent_name"
                        value={formData.agent_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="agent-form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="agent_email"
                        value={formData.agent_email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="agent-form-group">
                    <label>Telephone:</label>
                    <input
                        type="text"
                        name="agent_telephone"
                        value={formData.agent_telephone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="agent-form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        name="agent_address"
                        value={formData.agent_address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="agent-form-group">
                    <label>Team:</label>
                    <select name="agent_team" value={formData.agent_team} onChange={handleChange} required>
                        <option value="">Select Team</option>
                        {teamList.map((team) => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                </div>

                <div className="agent-form-group">
                    <label>Position:</label>
                    <select
                        name="agent_position"
                        value={formData.agent_position}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Position</option>
                        {posList.map((position) => (
                            <option key={position} value={position}>{position}</option>
                        ))}
                    </select>
                </div>

                <div className="agent-form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="agent_username"
                        value={formData.agent_username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="agent-form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="agent_password"
                        value={formData.agent_password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="agent-form-group">
                    <label>Image:</label>
                    <input
                        type="file"
                        id="agent-image-input" // Added ID for clearing
                        name="agent_image"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>

                <div className="agent-form-buttons">
                    <button type="reset" className="agent-form-button-discard" onClick={() => {
                        setFormData({
                            agent_name: '',
                            agent_email: '',
                            agent_telephone: '',
                            agent_address: '',
                            agent_position: '',
                            agent_team: '',
                            agent_username: '',
                            agent_password: '',
                            agent_image: null,
                        });
                        if (document.getElementById('agent-image-input')) {
                            document.getElementById('agent-image-input').value = '';
                        }
                        setMessage('');
                    }}>
                        Discard Changes
                    </button>
                    <button type="submit" className="agent-form-button-save" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Agent'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAgentForm;