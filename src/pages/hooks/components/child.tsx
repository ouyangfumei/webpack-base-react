import React, { useState, useCallback, PureComponent } from "react";

export default class Child extends React.PureComponent {
    // constructor(props){
    //     super(props)
    // }
    render() {
        console.log("child render");
        const { addClick } = this.props;
        return (
            <div>
                <p>Child</p>
                <button onClick={() => console.log(addClick())}>add</button>
            </div>
        );
    }
}