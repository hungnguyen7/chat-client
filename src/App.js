import React from 'react';
import './App.css';
import $ from 'jquery';
import _map from 'lodash/map';
import io from 'socket.io-client';
import MessageList from './message-list';
import Input from './input';
class App extends React.Component{
  constructor(props){
    super(props);
    this.loginRef = React.createRef();
    this.state={
      messages: [{
        id:0,
        message: 'Hi there'
      }],
      user: { // nguoi dung hien tai, neu rong se hien thi form login, nguoc lai se hien thi phong chat
        id:'',
        name: ''
      },
      userOnline:[] //danh sach nguoi dung dang online
    }
    this.socket = null;
    this.sendNewMessage = this.sendNewMessage.bind(this);
    this.login = this.login.bind(this);
  }

  //connect voi server nodejs thong qua socket.io
  componentDidMount(){
    this.socket = io('localhost:6969');
    //lang nghe event 'newMessage' va goi ham newMessage khi co event 'newMessage' phat sinh
    this.socket.on('newMessage', response=>{
      console.log(response)
      this.newMessage(response)
    })
    this.socket.on('newMessageFromChatbot', response=>{
      console.log(response)
      this.newMessage(response)
    })
    this.socket.on('loginFail', response=>{
      alert('Tên người dùng đã tồn tại')
    })
    this.socket.on('loginSuccess', response=>{
      this.setState({
        user: {
          id: this.socket.id,
          name: response
        }
      })
    })
    // update lai nguoi dung online khi co nguoi dung moi dang nhap hoac dang xuat
    this.socket.on('updateUserList', response=>{
      this.setState({
        userOnline: response
      })
    })
  }
  //Khi co tin nhan, push tin nhan vao state msg va se render ra man hinh
  newMessage(msg){
    console.log(msg);
    const messages = this.state.messages;
    let ids = _map(messages, 'id'); //Lay tat ca id tu state message va bo vao mot array
    let max = Math.max(...ids);
    messages.push({
      id: max+1,
      userId: msg.id, //msg.id == id cua nguoi gui
      message: msg.data, //msg.data == noi dung tin nhan
      userName: msg.user.name
    })
    // https://stackoverflow.com/questions/32783869/what-does-selector0-mean-in-jquery/43133473
    let objMessage = $('.messages');
    // https://javascript.info/size-and-scroll
    if(objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight){
      this.setState({
        messages
      })
      objMessage.animate({ // cuon toi cuoi
        scrollTop: objMessage.prop('scrollHeight')
      }, 300)
    }
    else{
      this.setState({
        messages
      })
      if(msg.id === this.state.user){
        objMessage.animate({
          scrollTop: objMessage.prop('scrollHeight')
        }, 300)
      }
    }
  }

  sendNewMessage(msg){
    if(msg.value){
      //gui event ve server
      console.log(msg.value);
      this.socket.emit('newMessage', {
        data: msg.value,
        user: this.state.user
      });
      this.socket.emit('newMessageFromChatbot', {
        data: msg.value,
        user: 'Rasa'
      });
      document.getElementById('input-field').value = '';
    }
  }

  login(){
    console.log(this.loginRef.current.value);
    this.socket.emit('login', this.loginRef.current.value);
    this.loginRef.current = null;
    
  }
  render(){
    return(
      <div className='app_content'>
        {/* kiểm tra xem user đã tồn tại hay chưa, nếu tồn tại thì render form chat, chưa thì render form login */}
        {this.state.user.id && this.state.user.name?
          <div className='chat_window'>
            <div className='menu'>
              <ul className='user'>
                <span className='user-name'>{this.state.user.name}</span>
                <p>Online</p>
                {this.state.userOnline.map(item=>{
                  return(
                    <li key={item.id}><span>{item.name}</span></li>
                  )
                })}
              </ul>
            </div>
            <div className='content'>
              <MessageList user={this.state.user} messages={this.state.messages}/>
              <Input sendMessage={this.sendNewMessage}/>
            </div>  
          </div>
          :
          <div className='login_form'>
                <input type='text' name='name' ref={this.loginRef}></input>
                <input type='button' value='Login' onClick={this.login}></input>
          </div>
        }
      </div>
    )
  }
}
export default App;
