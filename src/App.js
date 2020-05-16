import React,{useState,useEffect} from 'react';
import {uuid} from 'uuidv4';
import  './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';

//localStorage.getItem('item name');
//localStorage.setItem('item name');
// 
const initialExpenses= localStorage.getItem('expenses')? 
JSON.parse(localStorage.getItem("expenses")) :[] 

console.log(initialExpenses);


const App =()=>{

//**************state values ************//
// all expenses, add expense
const [expenses,setExpenses] = useState(initialExpenses);

//Single Expense
 const[charge,setCharge] = useState('');

 //Single amount
 const[amount,setAmount] = useState(0);

 //alert
 const[alert,setAlert] = useState({show:false});


 //edit
const[edit,setEdit] = useState(false);
 
//edit item
const[id,setId] = useState(0);

//*************useEffect*************//
useEffect(()=>{
    console.log('we called useEffect')
    localStorage.setItem('expenses',JSON.stringify(expenses))
},[expenses])



 //***********Functionality *************//
const handleCharge =(e)=>{
    setCharge(e.target.value)
}

const handleAmount =(e)=>{
    setAmount(e.target.value)
}

//handle Alert
const handleAlert =({type,text}) =>{
    setAlert({show:true,type,text});
    setTimeout(()=>{setAlert({show:false})},3000)
}

// clear all items
const clearItems =()=>{
    setExpenses([]);
    handleAlert({type:'danger',text:'all items deleted'});
}

//deleting a single item
const handleDelete=(id)=>{
let tempExpenses = expenses.filter(item => item.id !== id);
setExpenses(tempExpenses);
handleAlert({type:'danger',text:'item deleted'});
}

//Editing a single item
const handleEdit=(id)=>{
    let expense = expenses.find( item => item.id === id);
    let {charge,amount}= expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
   
    }


const handleSubmit = e =>{
    console.log('inside handle submit')
    e.preventDefault();

    if(charge !=="" && amount >0){
    if(edit){
        let tempExpenses = expenses.map(item => {
            return item.id === id ?{...item,charge,amount}:item
        });

        setExpenses(tempExpenses)
        handleAlert({type:'success',text:'item edited'});
        setEdit(false);
    }   
    else{
        const singleExpense = {id: uuid(),charge,amount};
        setExpenses([...expenses,singleExpense]);
        handleAlert({type:'success',text:'item added'});
    } 
       
        setCharge('');
        setAmount('');

    }
    else{
        handleAlert({type:'danger',text:`charge can't be empty value and amount value has to bigger than zero`})
    }
}


    return(
        <>
        {alert.show && <Alert type={alert.type} text={alert.text} />}
          
          <h1>Budget Calculator</h1> 
          <main className="App">
          <ExpenseForm charge={charge} amount={amount} handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
          />
          <ExpenseList expenses={expenses} handleDelete={handleDelete}
           handleEdit={handleEdit} clearItems={clearItems}/>
              </main>   
         
         <h1>
             total spending: <span className="total">
                 $ {expenses.reduce((acc,curr)=>{
                   return  (acc += parseInt(curr.amount))
                 },0)}
             </span>
         </h1>
         
        </>
    )
}

export default App;