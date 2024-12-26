import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import MDEditor from '@uiw/react-md-editor';
import "react-datepicker/dist/react-datepicker.css";
import {
    TextField,
    IconButton,
    Tooltip,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ListAlt as ListAltIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import NotActive from '../common/NotActive';
// import { updateAssignment } from '../../features/assignment/assignmentSlice';

const AssignmentEditComponent = () => {
    const { assignmentId } = useParams();
    const dispatch = useDispatch();
    const { assignmentDetails } = useSelector(state => state.assignment);
    const currentAssignment = assignmentDetails[assignmentId] || {};

    const [formData, setFormData] = useState({
        title: currentAssignment.title || '',
        description: currentAssignment.description || '',
        iteration_date: currentAssignment.iteration_date ? new Date(currentAssignment.iteration_date) : null,
        due_date: currentAssignment.due_date ? new Date(currentAssignment.due_date) : null,
        details: currentAssignment.assignment_detail_list || [],
        subtasks: currentAssignment.subtask_list || []
    });
    const [errors, setErrors] = useState({});

    const handleSubmit = async () => {
        try {
            await dispatch(updateAssignment({
                assignmentId,
                ...formData,
                iteration_date: formData.iteration_date?.toISOString(),
                due_date: formData.due_date?.toISOString()
            })).unwrap();
        } catch (error) {
            setErrors(error);
        }
    };

    const handleAddDetail = () => {
        setFormData(prev => ({
            ...prev,
            details: [...prev.details, { title: '', description: '' }]
        }));
    };

    const handleDetailChange = (index, field, value) => {
        const newDetails = [...formData.details];
        newDetails[index][field] = value;
        setFormData(prev => ({ ...prev, details: newDetails }));
    };
    const handleAddSubtask = () => {
        setFormData(prev => ({
            ...prev,
            subtasks: [...prev.subtasks, { title: '', description: '', tag: 'optional' }]
        }));
    }

    return (
        <div className='flex flex-row h-[calc(100vh-3.5rem)] bg-backg_1'>
            <div className='bg-backg_1 grow overflow-auto h-full border-r border-gray-500'>
                <div className='bg-backg_1 flex flex-col p-2 w-lg h-full text-left overflow-auto'>
                    <div className='bg-backg_dark rounded-md overflow-auto [&::-webkit-scrollbar]:hidden mt-2 h-full'>
                        <div className='sticky top-0 z-10 bg-backg_1 p-4 border-b border-gray-700 flex justify-between items-center'>
                            <h2 className='text-2xl font-semibold text-light_white'>Edit Assignment</h2>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSubmit}
                                className='bg-[#70B0FF] hover:bg-[#5A8FD9]'
                            >
                                Save Changes
                            </Button>
                        </div>

                        <div className='flex-1 p-4 space-y-6'>
                            {/* Core Details */}
                            <section className='bg-[#1A1B1E] rounded-lg p-6 space-y-4'>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    className='bg-[#202225] rounded'
                                />

                                <div className='bg-[#202225] rounded p-4'>
                                    <MDEditor
                                        value={formData.description}
                                        onChange={(value) => setFormData(prev => ({ ...prev, description: value || '' }))}
                                        preview="edit"
                                    />
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <DatePicker
                                        selected={formData.iteration_date}
                                        onChange={(date) => setFormData(prev => ({ ...prev, iteration_date: date }))}
                                        showTimeSelect
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        className='w-full p-2 bg-[#202225] text-light_white rounded'
                                        placeholderText="Select iteration date"
                                    />
                                    <DatePicker
                                        selected={formData.due_date}
                                        onChange={(date) => setFormData(prev => ({ ...prev, due_date: date }))}
                                        showTimeSelect
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        className='w-full p-2 bg-[#202225] text-light_white rounded'
                                        placeholderText="Select due date"
                                    />
                                </div>
                            </section>

                            {/* Details Section */}
                            <section className='bg-[#1A1B1E] rounded-lg p-6'>
                                <div className='flex justify-between items-center mb-6'>
                                    <h3 className='text-xl font-semibold text-light_white flex items-center gap-2'>
                                        <ListAltIcon className='text-[#70B0FF]' />
                                        Assignment Details
                                    </h3>
                                    <Tooltip title="Add Detail">
                                        <IconButton onClick={handleAddDetail} className='text-[#70B0FF] hover:bg-[#70B0FF]/10'>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>

                                <div className='space-y-4'>
                                    {formData.details.map((detail, index) => (
                                        <div key={detail.id || index}
                                            className='group bg-gradient-to-r from-[#202225] to-[#2D2F34] p-[1px] rounded-lg 
                                          hover:from-[#70B0FF] hover:to-[#5A8FD9] transition-all duration-300'>
                                            <div className='bg-[#202225] rounded-lg p-4'>
                                                <div className='flex justify-between items-center mb-3'>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={detail.title}
                                                        onChange={(e) => handleDetailChange(index, 'title', e.target.value)}
                                                        className='bg-[#252428] rounded mr-4'
                                                        InputProps={{ className: 'text-light_white' }}
                                                        placeholder="Detail Title"
                                                    />
                                                    <IconButton
                                                        onClick={() => handleDeleteDetail(index)}
                                                        className='text-red-400 hover:bg-red-400/10'
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                                <MDEditor
                                                    value={detail.description}
                                                    onChange={(value) => handleDetailChange(index, 'description', value || '')}
                                                    preview="edit"
                                                    className='bg-[#252428] rounded'
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Subtasks Section */}
                            <section className='bg-[#1A1B1E] rounded-lg p-6'>
                                <div className='flex justify-between items-center mb-6'>
                                    <h3 className='text-xl font-semibold text-light_white flex items-center gap-2'>
                                        <ListAltIcon className='text-[#70B0FF]' />
                                        Subtasks
                                    </h3>
                                    <Tooltip title="Add Subtask">
                                        <IconButton onClick={handleAddSubtask} className='text-[#70B0FF] hover:bg-[#70B0FF]/10'>
                                            <AddIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>

                                <div className='space-y-4'>
                                    {formData.subtasks.map((subtask, index) => (
                                        <div key={subtask.id || index}
                                            className='group bg-gradient-to-r from-[#202225] to-[#2D2F34] p-[1px] rounded-lg 
                                          hover:from-[#70B0FF] hover:to-[#5A8FD9] transition-all duration-300'>
                                            <div className='bg-[#202225] rounded-lg p-4'>
                                                <div className='flex items-center gap-4 mb-3'>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={subtask.title}
                                                        onChange={(e) => handleSubtaskChange(index, 'title', e.target.value)}
                                                        className='bg-[#252428] rounded'
                                                        InputProps={{ className: 'text-light_white' }}
                                                        placeholder="Subtask Title"
                                                    />
                                                    <FormControl className='min-w-[150px] bg-[#252428] rounded'>
                                                        <Select
                                                            value={subtask.tag || 'optional'}
                                                            onChange={(e) => handleSubtaskChange(index, 'tag', e.target.value)}
                                                            className='text-light_white'
                                                            size="small"
                                                        >
                                                            <MenuItem value="compulsory" className='text-red-400'>Compulsory</MenuItem>
                                                            <MenuItem value="optional" className='text-[#70B0FF]'>Optional</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <IconButton
                                                        onClick={() => handleDeleteSubtask(index)}
                                                        className='text-red-400 hover:bg-red-400/10'
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                                <MDEditor
                                                    value={subtask.description}
                                                    onChange={(value) => handleSubtaskChange(index, 'description', value || '')}
                                                    preview="edit"
                                                    className='bg-[#252428] rounded'
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-[calc(200%/5)] min-w-[calc(200%/5)] h-full overflow-auto [&::-webkit-scrollbar]:hidden">
                <NotActive />
            </div>
        </div>
    );
};

export default AssignmentEditComponent;