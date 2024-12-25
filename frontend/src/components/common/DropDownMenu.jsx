import React, { useEffect, useRef } from 'react';
import { Fade } from '@mui/material';

const DropdownMenu = ({ open, anchorEl, onClose, children }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!open) return null;

    const anchorRect = anchorEl?.getBoundingClientRect();
    console.log(anchorRect);

    return (
        <Fade in={open}>
            <div
                ref={dropdownRef}
                className="absolute z-50 min-w-[200px] py-1 bg-[#2f3133] rounded-md shadow-lg border border-gray-600/30"
                style={{
                    top: (anchorRect?.bottom || 0) -40,
                    left: (anchorRect?.left || 0) + 30,
                }}
            >
                {children}
            </div>
        </Fade>
    );
};

export const MenuItem = ({ icon, children, onClick }) => (
    <button
        className="w-full px-4 py-2 text-sm text-light_white hover:bg-[#4E5058] flex items-center gap-2"
        onClick={onClick}
    >
        {icon && <span className="w-5 h-5">{icon}</span>}
        {children}
    </button>
);

export default DropdownMenu;