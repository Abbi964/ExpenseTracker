const amount = document.getElementById('amountInput')
const category = document.getElementById('Category')
const description = document.getElementById('description')
const form = document.querySelector('.form-class')
const expenseList = document.querySelector('.expenseList')
const prompt = document.querySelector('.prompt')


form.addEventListener('submit',addExpense);

async function addExpense(e){
    e.preventDefault()
    if(amount.value==='' || category.value==='' || description.value===''){
        prompt.innerHTML = '<p>Please Fill all the fields</p>'
        setTimeout(()=>prompt.innerHTML='',1000)
    }
    else{
        try{
            // amking an obj of inputs and also token
            let expenseInfo = {
                amount:  amount.value, 
                category: category.value, 
                description:  description.value, 
                token:  localStorage.getItem('token')
            };
            // making a post request and returning id of expense
            let response = await axios.post('http://localhost:3000/expense/addexpense',expenseInfo);
            //Displaying expense in DOM
            // making an list item
            let li = makeLi(response.data, amount.value, category.value, description.value);
            // appending a delete btn
            let delBtn = makeDelBtn();
            li.appendChild(delBtn)
            //appending edit button
            let editBtn = makeEditBtn();
            li.appendChild(editBtn)
            //appending li to ul
            expenseList.appendChild(li);
        }
        catch(err){
            console.log(err)
        }
    }
}

//-----modifying expenses using del and edit button---//
expenseList.addEventListener('click',modifyExpense);

async function modifyExpense(e){
    //when del button is clicked
    if(e.target.className==='delBtn'){
        try{
            // deleting expense from database
            let li_id = e.target.parentElement.id;
            let token = localStorage.getItem('token')
            await axios.delete(`http://localhost:3000/expense/delete/${li_id}`,{
                headers:{'Authorization':token}
            })
            // deleting from DOM
            let li = document.getElementById(li_id)
            li.remove()
        }
        catch(err){
            console.log(err)
        }
    }
}

//-----loading all expenses when page is loded----///
window.addEventListener('DOMContentLoaded',loadExpenses)

async function loadExpenses(e){
    try{
        // getting all expenses from database of user logged(using JWT)
        let token = localStorage.getItem('token')
        let response = await axios.get('http://localhost:3000/expense/all_expenses',{ headers:{ 'Authorization': token }})
        let expensesArray = response.data
        expensesArray.forEach((exp)=>{
            //making an list item
            let li = makeLi(exp.id, exp.amount, exp.category, exp.description);
            // appending a delete button
            let delBtn = makeDelBtn();
            li.appendChild(delBtn);
            // appending an edit button
            let editBtn = makeEditBtn(); 
            li.appendChild(editBtn)
            //appending to ul
            expenseList.appendChild(li)
        })
    }
    catch(err){
        console.log(err)
    }
}



function makeLi(id,amount,category,description){
    let li = document.createElement('li');
    li.id = id
    li.className = 'listItem'
    li.innerHTML = `<p>Rs${amount} - ${category} - ${description}</p>`
    return li
}

function makeDelBtn(){
    let delBtn = document.createElement('button');
    delBtn.className = 'delBtn'
    delBtn.innerText = 'Del'
    return delBtn
}

function makeEditBtn(){
    let editBtn = document.createElement('button');
    editBtn.className = 'editBtn'
    editBtn.innerText = 'Edit'
    return editBtn
}