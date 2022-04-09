import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/*
Params : 
    open: true
    timer: time in milliseconds
    severity : success | error | warning | info
    message: message to show
*/
export default function CustomizedSnackbars(props) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            props.functionCallback();
            return;
        }
        props.functionCallback();
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={props.open} autoHideDuration={props.timer} onClose={handleClose}>
                <Alert onClose={handleClose} severity={props.severity} sx={{ width: '100%' }}>
                    {props.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}