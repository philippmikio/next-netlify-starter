import React, { useState } from 'react';

const Form = ({ handleAddNode }) => {
    const [nodeName, setNodeName] = useState('');
    const [nodeId, setNodeId] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        handleAddNode(nodeName, nodeId);
        setNodeName('');
        setNodeId('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={nodeName} onChange={e => setNodeName(e.target.value)} placeholder="Node Name" required />
            <input type="text" value={nodeId} onChange={e => setNodeId(e.target.value)} placeholder="Node ID" required />
            <button type="submit">Add Node</button>
        </form>
    );
};

export default Form;
