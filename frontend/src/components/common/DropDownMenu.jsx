import React, { useEffect, useRef } from 'react';
import { Fade, Paper, ButtonBase, styled } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#2f3133',
    borderRadius: theme.spacing(1),
    border: '1px solid rgba(255, 255, 255, 0.1)',
    minWidth: 220,
}));

const StyledMenuItem = styled(ButtonBase)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(1.5, 2),
    textAlign: 'left',
    color: '#e1e1e1',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(1.5),
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: '#4E5058',
        transform: 'translateX(4px)',
    },
}));

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

    return (
        <Fade in={open} timeout={200}>
            <StyledPaper
                ref={dropdownRef}
                elevation={8}
                sx={{
                    position: 'absolute',
                    zIndex: 1300,
                    top: (anchorRect?.bottom || 0) - 40,
                    left: (anchorRect?.left || 0) + 30,
                    overflow: 'hidden',
                }}
            >
                {children}
            </StyledPaper>
        </Fade>
    );
};

export const MenuItem = ({ icon, children, onClick }) => (
    <StyledMenuItem onClick={onClick}>
        {icon && <span className="w-5 h-5 ">{icon}</span>}
        {children}
    </StyledMenuItem>
);

export default DropdownMenu;