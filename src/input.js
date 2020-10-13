import React from 'react';
export default class Input extends React.Component{
    constructor(props){
        super(props);
        // https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs
        // https://viblo.asia/p/refs-in-react-tat-ca-nhung-gi-ban-can-biet-V3m5WOgQ5O7
        this.msgInputRef = React.createRef();
    }
    checkEnter(event){
        if(event.keyCode === 13){
            this.props.sendMessage(this.msgInputRef.current);
            document.getElementById('input-field').value = '';
        }
    }
    render(){
        return(
            <div className="">
                <div className='bottom_wrapper clearfix'>
                    <div className='message_input_wrapper'>
                        <input id='input-field' ref={this.msgInputRef} type="text" className="message_input" placeholder='Type your message here' onKeyUp={this.checkEnter.bind(this)}></input>
                    </div>
                    <div className='send_message' onClick={()=>this.props.sendMessage(this.msgInputRef.current)}>
                        <div className='icon'></div>
                        <div className='text'>Send</div>
                    </div>
                </div>
            </div>
        )
    }
}