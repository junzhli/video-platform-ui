import React, {useContext, useRef, useState} from "react";
import { useTheme} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import ListItemText from "@material-ui/core/ListItemText";
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {GlobalStateContext} from "../store";
import Link from "next/link";
import {IResponsiveDrawerProps} from "./types/ResponsiveDrawer";
import {useRouter} from "next/router";
import {AppBar, Button, Drawer, Hidden, InputBase, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/More";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
            marginRight: theme.spacing(2),
        },
        menuButtonAlwaysOn: {
            marginRight: theme.spacing(2),
        },
        title: {
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(10),
                width: "auto",
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '50ch',
            },
        },
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        //
        root: {
            display: 'flex',
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            [theme.breakpoints.up('sm')]: {
                // width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth,
                width: `100%`,
            },
        },
        // menuButton: {
        //     marginRight: theme.spacing(2),
        //     [theme.breakpoints.up('sm')]: {
        //         display: 'none',
        //     },
        // },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
);

export const ResponsiveDrawer: React.FC<IResponsiveDrawerProps> = (props) => {
    const logoutForm = useRef(null);

    // const { window } = props;
    const router = useRouter();
    const {state} = useContext(GlobalStateContext);
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <List>
                <Link href={"/upload"}>
                    <ListItem button key="Upload Video">
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary="Upload Video" />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                {/*{['Home', 'Starred', 'Library'].map((text, index) => (*/}
                {/*    <ListItem button key={text}>*/}
                {/*        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>*/}
                {/*        <ListItemText primary={text} />*/}
                {/*    </ListItem>*/}
                {/*))}*/}
                <Link href={"/"}>
                    <ListItem button key={"Home"}>
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary={"Home"} />
                    </ListItem>
                </Link>
                <Link href={"/history"}>
                    <ListItem button key={"History"}>
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary={"History"} />
                    </ListItem>
                </Link>
                <Link href={"/myvideos"}>
                    <ListItem button key={"Library"}>
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary={"Library"} />
                    </ListItem>
                </Link>
            </List>
            <Divider />
            {/*<List>*/}
            {/*    {['All mail', 'Trash', 'Spam'].map((text, index) => (*/}
            {/*        <ListItem button key={text}>*/}
            {/*            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>*/}
            {/*            <ListItemText primary={text} />*/}
            {/*        </ListItem>*/}
            {/*    ))}*/}
            {/*</List>*/}
        </div>
    );

    // const container = typeof window !== "undefined" ? () => window.document.body : undefined;

    // const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    // console.log(anchorEl === null);
    // console.log(mobileMoreAnchorEl === null);


    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        handleMobileMenuClose();
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleUserSignOut = () => {
        handleMenuClose();
        logoutForm.current.dispatchEvent(new Event("submit"));
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {
                (!state.userMisc.userLoggedIn) ? (
                    <MenuItem key={"login"} onClick={handleMenuClose}>
                        <Link href={"/login"}>
                            Login
                        </Link>
                    </MenuItem>
                ) : (
                    [
                        <MenuItem key={"my-account"} onClick={handleMenuClose}>My Account</MenuItem>,
                        <MenuItem key={"sign-out"} onClick={handleUserSignOut}>
                            <form ref={logoutForm} action={"/api/user/logout"}>
                                Sign out
                            </form>
                        </MenuItem>
                    ]
                )
            }
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {/*<MenuItem>*/}
            {/*    <IconButton aria-label="show 4 new mails" color="inherit">*/}
            {/*        <Badge badgeContent={4} color="secondary">*/}
            {/*            <MailIcon />*/}
            {/*        </Badge>*/}
            {/*    </IconButton>*/}
            {/*    <p>Messages</p>*/}
            {/*</MenuItem>*/}
            <MenuItem>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    )
    const [queryText, setQueryText] = useState<string>(props.query || "");
    const searchBarOnKeyPressed = async (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            await router.push(`/result?query=${queryText}`);
        }
    }

    const searchBarValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQueryText(event.target.value);
    }

    return (
        <div className={classes.root}>
            {/*<CssBaseline />*/}
            {/* Main menu */}
            <AppBar position="fixed" className={classes.appBar}>
                {/*<Toolbar>*/}
                {/*    <IconButton*/}
                {/*        color="inherit"*/}
                {/*        aria-label="open drawer"*/}
                {/*        edge="start"*/}
                {/*        onClick={handleDrawerToggle}*/}
                {/*        className={classes.menuButton}*/}
                {/*    >*/}
                {/*        <MenuIcon />*/}
                {/*    </IconButton>*/}
                {/*    <Typography variant="h6" noWrap>*/}
                {/*        Responsive drawer*/}
                {/*    </Typography>*/}
                {/*</Toolbar>*/}
                <Toolbar>
                    {/* Desktop sections */}
                    <IconButton
                        edge="start"
                        className={(props.videoOn) ? classes.menuButtonAlwaysOn : classes.menuButton}
                        onClick={handleDrawerToggle}
                        color="inherit"
                        aria-label="open drawer"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        VUpload.com
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            value={queryText}
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyPress={searchBarOnKeyPressed}
                            onChange={searchBarValueChanged}
                        />
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        {/*<IconButton aria-label="show 4 new mails" color="inherit">*/}
                        {/*    <Badge badgeContent={4} color="secondary">*/}
                        {/*        <MailIcon />*/}
                        {/*    </Badge>*/}
                        {/*</IconButton>*/}
                        {(!state.userMisc.userLoggedIn) ? (
                            <Link href={"/login"}>
                                <Button variant="contained">Log in</Button>
                            </Link>
                        ) : (
                            <>
                                <IconButton aria-label="show 17 new notifications" color="inherit">
                                    <Badge badgeContent={17} color="secondary">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </>
                        )}

                        {renderMenu}
                    </div>
                    {/* Mobile sections */}
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                        {renderMobileMenu}
                    </div>
                </Toolbar>
            </AppBar>
            {/* Main nav bar */}
            <nav className={(!props.videoOn) && classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        // container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                {
                    (!props.videoOn) && (
                        <Hidden xsDown implementation="css">
                            <Drawer
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                                variant="permanent"
                                open
                            >
                                {drawer}
                            </Drawer>
                        </Hidden>
                    )
                }
            </nav>
            {/* Content */}
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {props.children}
            </main>
        </div>
    );
}
;