import React from 'react';
import MessageItem from './message-item';
export default class MessageList extends React.Component{
    render(){
        return(
            <ul className='messages clo-md-5'>
                {this.props.messages.map(item=>{
                    return(
                        <MessageItem key={item.id} user={item.userName === this.props.user.name?true:false} message={item}/>
                    )
                })}
            </ul>
        )
    }
}