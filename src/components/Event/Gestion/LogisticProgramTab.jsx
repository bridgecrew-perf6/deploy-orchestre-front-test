import React from "react";
import { IconButton, Collapse, Paper } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ModifyLogisticProgramForm from "../forms/ModifyLogisticProgramForm";

class LogisticProgramTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    render() {
        return (
            <div style={{ backgroundColor: "white", borderRadius: "5px", marginBottom: "20px" }}>
                <Paper elevation={3}>
                    <div style={{ display: "flex" }}>
                        <p style={{ marginLeft: "20px" }}>Programme & Logistique</p>
                        <div style={{ margin: "auto 10px auto auto" }}>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => this.setState({ open: !this.state.open })}
                            >
                                {this.state.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </div>
                    </div>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                            <ModifyLogisticProgramForm event={this.props.event} functionCallback={(event) => this.props.functionCallback(event)} />
                        </div>
                    </Collapse>
                </Paper>
            </div>
        )
    }
}

export default LogisticProgramTab;