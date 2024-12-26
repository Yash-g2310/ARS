import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import MDEditor from '@uiw/react-md-editor';
import "react-datepicker/dist/react-datepicker.css";
import { TextField, IconButton, Tooltip, Button, Select, MenuItem, FormControl, InputLabel, InputAdornment } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, ListAlt as ListAltIcon, Save as SaveIcon, TitleOutlined, Description, CalendarToday } from '@mui/icons-material';
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
    };

    const handleSubtaskChange = (index, field, value) => {
        const newSubtasks = [...formData.subtasks];
        newSubtasks[index][field] = value;
        setFormData(prev => ({ ...prev, subtasks: newSubtasks }));
    };

    const handleDeleteDetail = (index) => {
        const newDetails = formData.details.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, details: newDetails }));
    };

    const handleDeleteSubtask = (index) => {
        const newSubtasks = formData.subtasks.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, subtasks: newSubtasks }));
    };

    return (
        <div className='flex flex-row h-[calc(100vh-3.5rem)] bg-backg_1'>
            <div className='bg-backg_1 grow overflow-auto h-full border-r border-gray-500'>
                <div className='bg-backg_1 flex flex-col p-2 w-lg h-full text-left overflow-auto'>
                    <div className='bg-backg_dark rounded-md overflow-auto [&::-webkit-scrollbar]:hidden mt-2 h-full'>
                        <div className='sticky top-0 z-10 backdrop-blur-sm bg-opacity-80'>
                            <div className='mx-3 my-1.5'>
                                <div className='bg-gradient-to-br from-[#1A1B1E]/90 to-[#2D2F34]/90 rounded-lg border border-gray-800/30 shadow-lg'>
                                    <div className='backdrop-blur-sm bg-backg_1/30 rounded-lg p-4 flex justify-between items-center'>
                                        <h2 className='flex items-center gap-3'>
                                            <div className='relative group'>
                                                <div className='bg-[#252428] p-2.5 rounded-full shadow-md border border-gray-700/30 group-hover:border-[#70B0FF]/30 transition-all duration-300'>
                                                    <img
                                                        src="/assets/svg/smallHashtag.svg"
                                                        alt=""
                                                        className='w-4 h-4 group-hover:rotate-12 transition-transform duration-300'
                                                    />
                                                </div>
                                            </div>
                                            <span className='text-xl font-semibold text-light_white tracking-wide'>
                                                Edit Assignment
                                            </span>
                                        </h2>
                                        <Button
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            onClick={handleSubmit}
                                            className='bg-gradient-to-r from-[#70B0FF] to-[#5A8FD9] hover:from-[#82BAFF] hover:to-[#6A9FE9] 
                                            px-5 py-1.5 rounded-lg transition-all duration-300 text-white shadow-lg 
                                            hover:shadow-[#70B0FF]/20 hover:shadow-xl transform hover:-translate-y-0.5
                                            border border-white/10'
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex-1 p-4 space-y-6'>
                            {/* Core Details */}
                            <section className='bg-gradient-to-br from-[#1A1B1E] to-[#2D2F34] rounded-xl p-6 space-y-6 shadow-lg border border-gray-800/30'>
                                <div className='relative group'>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        error={!!errors.title}
                                        helperText={errors.title}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <TitleOutlined className='text-gray-400 group-hover:text-[#70B0FF] transition-colors duration-300' />
                                                </InputAdornment>
                                            ),
                                            className: 'text-light_white'
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: '#1A1B1E',
                                                borderRadius: '12px',
                                                transition: 'all 0.3s ease',
                                                padding: '0.5rem',
                                                '&:hover': {
                                                    backgroundColor: '#202225',
                                                },
                                                '&.Mui-focused': {
                                                    '& fieldset': {
                                                        borderColor: '#70B0FF !important',
                                                        borderWidth: '1px !important',
                                                    },
                                                },
                                                '& fieldset': {
                                                    borderColor: 'rgba(255,255,255,0.1)',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: '#9BA1A6',
                                                '&.Mui-focused': {
                                                    color: '#70B0FF',
                                                },
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                color: '#E4E6EA',
                                            },
                                        }}
                                    />
                                </div>

                                <div className='bg-backg_1 rounded-xl p-4 border border-gray-800/30 hover:border-gray-700/50 transition-all duration-300 group'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <Description className='text-gray-400 group-hover:text-[#70B0FF] transition-colors duration-300' />
                                        <span className='text-gray-400 group-hover:text-[#70B0FF] transition-colors duration-300'>Description</span>
                                    </div>
                                    <MDEditor
                                        value={formData.description}
                                        onChange={(value) => setFormData(prev => ({ ...prev, description: value || '' }))}
                                        preview="edit"
                                        className='min-h-[200px]
        [&]:border-gray-700/50
        [&_.w-md-editor]:!bg-backg_1 
        [&_.w-md-editor-toolbar]:!bg-backg_1 
        [&_.w-md-editor-toolbar]:!border-gray-700/50
        [&_.w-md-editor-content]:!bg-backg_1 
        [&_.w-md-editor-content]:!border-gray-700/50
        [&_.w-md-editor-input]:!text-light_white
        [&_.w-md-editor-preview]:!text-light_white
        [&_.w-md-editor-text-pre>code]:!text-light_white
        [&_.w-md-editor-text-pre>pre]:!bg-backg_dark
        [&_.w-md-editor-text-input]:!text-light_white
        [&_.w-md-editor-text]:!bg-backg_1
        [&_textarea]:!text-light_white
        [&_textarea]:focus:!outline-none
        [&_textarea]:focus:!ring-0
        [&_textarea]:focus:!border-transparent
        [&_button]:!text-gray-400
        [&_button:hover]:!bg-[#70B0FF]/20 
        [&_button]:transition-all 
        [&_button]:duration-300
        [&_.wmde-markdown]:!text-light_white
        [&_.wmde-markdown-color]:!text-light_white
        [&]:focus-within:!outline-none
        [&]:focus-within:!ring-0
        [&]:focus-within:!border-gray-700/50
        [&_.w-md-editor-text-pre]:!bg-backg_1
        [&_.w-md-editor-text-pre>pre]:!text-light_white'
                                        textareaProps={{
                                            style: {
                                                color: '#E4E6EA',
                                                backgroundColor: 'transparent'
                                            }
                                        }}
                                    />
                                </div>

                                <div className='grid grid-cols-2 gap-6'>
                                    {['iteration_date', 'due_date'].map((dateType) => (
                                        <div key={dateType} className='relative group'>
                                            <div className='bg-backg_1 rounded-xl p-4 border border-gray-800/30 hover:border-gray-700/50 
                                                          transition-all duration-300'>
                                                <div className='flex items-center gap-2 mb-2'>
                                                    <CalendarToday className='text-gray-400 group-hover:text-[#70B0FF] transition-colors duration-300' />
                                                    <span className='text-gray-400 capitalize group-hover:text-[#70B0FF] transition-colors duration-300'>
                                                        {dateType.split('_').join(' ')}
                                                    </span>
                                                </div>
                                                <DatePicker
                                                    selected={formData[dateType]}
                                                    onChange={(date) => setFormData(prev => ({ ...prev, [dateType]: date }))}
                                                    showTimeSelect
                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                    className='w-full p-2 bg-transparent text-light_white focus:outline-none focus:ring-0
                                                             border-none cursor-pointer'
                                                    placeholderText={`Select ${dateType.split('_').join(' ')}`}
                                                    wrapperClassName='w-full'
                                                    calendarClassName='bg-backg_1 border border-gray-700/50 shadow-xl rounded-xl 
                                                                    [&_.react-datepicker__header]:bg-backg_1 
                                                                    [&_.react-datepicker__day--selected]:bg-[#70B0FF]
                                                                    [&_.react-datepicker__day]:text-light_white
                                                                    [&_.react-datepicker__day:hover]:bg-[#70B0FF]/20'
                                                />
                                            </div>
                                        </div>
                                    ))}
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