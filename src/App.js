import React, {useEffect, useState} from 'react';
import {Table, Button, Modal, Input, Form} from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import axios from 'axios';

const {Item} = Form;

const layout = {
  labelCol:{
    span: 4
  },
  wrapperCol: {
    spa: 12
  }
};

function App() {

  const baseUrl = "http://localhost:3001/tasks";

  const [data, setData] = useState([]);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [task, setTask] = useState({
    id: '',
    task: '',
    who: '',
    dueDate: ''
  })

  const abrirCerrarModalAdd = () =>{
    setModalAdd(!modalAdd);
  }

  const abrirCerrarModalEdit = () =>{
    setModalEdit(!modalEdit);
  }

  const abrirCerrarModalDelete = () =>{
    setModalDelete(!modalDelete);
  }

  const handleChange = i =>{
    const {name, value} = i.target;
    setTask({...task,
    [name]: value});
    console.log(task)

  }

  const selectTask=(task, caso) =>{
    setTask(task);
    (caso==="Edit") && abrirCerrarModalEdit();(caso==="Delete") && abrirCerrarModalDelete();
  }

  const colums=[
    {
      title:'ID',
      dataIndex:'id',
      key:'id'
    },
    {
      title:'Task',
      dataIndex:'task',
      key:'task'
    },
    {
      title:'Who',
      dataIndex:'who',
      key:'who'
    },
    {
      title:'Due Date',
      dataIndex:'dueDate',
      key:'duedate'
    },
    {
      title:'Actions',
      key:'acciones',
      render: (fila) => (
        <> 
      <Button type= 'primary' onClick = {()=>selectTask(fila,"Edit")}>Edit</Button> {'  '}
      <Button type= 'primary' danger onClick = {()=>selectTask(fila,"Delete")}>Delete
      </Button>
        </>
      ),
    },
  ];

  const peticionGet = async() =>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  } 
  
  const peticionPost = async() =>{
    delete task.id;
    await axios.post(baseUrl, task)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalAdd();
    }).catch(error=>{
      console.log(error);
    })
  } 

  const peticionPut = async() =>{
    await axios.put(baseUrl+"/"+task.id, task)
    .then(response=>{
      var dataAuxiliar=data;
      dataAuxiliar.forEach(elemento=>{
        if(elemento.id === task.id){
          elemento.task = task.task;
          elemento.who = task.who; 
          elemento.dueDate = task.dueDate; 
        }
      });
      setData(dataAuxiliar);
      abrirCerrarModalEdit();
    }).catch(error=>{
      console.log(error);
    })
  } 

  const peticionDelete = async() =>{
    await axios.delete(baseUrl+"/"+task.id)
    .then(response=>{
      setData(data.filter(elemento=>elemento.id!==task.id));
      abrirCerrarModalDelete();
    }).catch(error=>{
      console.log(error);
    })
  } 

  useEffect( ()=>{
    peticionGet();
  },[])



  return (
    <div className="App">
      <header className="App-header">
        <p>To Do List :</p>
      </header>

      <div className="container">
      <Button type='primary'  className="new" onClick={abrirCerrarModalAdd}>
        New Task
      </Button>
      <Table columns={colums} dataSource={data}></Table>
      </div>

      <Modal 
      visible = {modalAdd}
      title = "New Task"
      destroyOnClose = {true}
      onCancel={abrirCerrarModalAdd}
      centered
      footer = {[
        <Button type = 'primary' onClick = {peticionPost}> Insert new task </Button>,
        <Button onClick = {abrirCerrarModalAdd}> Cancel </Button>,
        
      ]}
      >
      <Form {...layout}>
        <Item label = "Task">
          <Input name= "task" onChange={handleChange} />
        </Item>
        <Item label = "Who">
          <Input name= "who" onChange={handleChange} />
        </Item>
        <Item label = "Due Date">
          <Input name= "dueDate" onChange={handleChange} />
        </Item>
      </Form>
      </Modal>

      
      <Modal 
      visible = {modalEdit}
      title = "Edit Task"
      onCancel={abrirCerrarModalEdit}
      centered
      footer = {[
        <Button type = 'primary' onClick={peticionPut}> Edit task </Button>,
        <Button onClick = {abrirCerrarModalEdit}> Cancel </Button>,
        
      ]}
      >
      <Form {...layout}>
        <Item label = "Task">
          <Input name= "task" onChange={handleChange} value={task && task.task} />
        </Item>
        <Item label = "Who">
          <Input name= "who" onChange={handleChange} value={task && task.who} />
        </Item>
        <Item label = "Due Date">
          <Input name= "dueDate" onChange={handleChange} value={task && task.dueDate} />
        </Item>
      </Form>
      </Modal>

      <Modal 
      visible = {modalDelete}
      onCancel={abrirCerrarModalDelete}
      centered
      footer = {[
        <Button type = 'primary' danger onClick= {peticionDelete} > Si </Button>,
        <Button onClick = {abrirCerrarModalDelete}> No </Button>,
        
      ]}
      >
        Are you sure that you wanna delete the task <b>{task && task.task}</b>?
      </Modal>

    </div>
  );
}

export default App;
