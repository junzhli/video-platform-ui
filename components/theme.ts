import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
    zIndex: {
        appBar: 1200,
        drawer: 1100
    },
    palette: {
        primary: {
            main: '#2b2b2b',
        },
        secondary: {
            main: '#3887a4',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
        },
    },
});

export default theme;