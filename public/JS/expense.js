const amount = document.getElementById('amountInput')
const category = document.getElementById('Category')
const description = document.getElementById('description')
const form = document.querySelector('.form-class')
const expenseList = document.querySelector('.expenseList')
const prompt = document.querySelector('.prompt')

let premium = false;


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

            // crearing the inputs
            amount.value = ''
            description.value = ''
        }
        catch(err){
            console.log(err)
        }
    }
}

//-----activating premium with buy premium button----//
const buyPremium = document.querySelector('.buyPremium');
buyPremium.addEventListener('click',activatePremium);

async function activatePremium(e){
    let token = localStorage.getItem('token')
    let response = await axios.get('http://localhost:3000/order/purchasePremium',{headers:{'Authorization':token}})
    // making an object to pass as option in new razorpay obj which will be made
    let options = {
        key:response.data.key_id,
        order_id: response.data.order.id,
        handler: async function(respo){
            // handeler is CB fn which will be called by razorpay when payment will be successful
            console.log(respo)
            await axios.post('http://localhost:3000/order/updateTransectionStatus',{
                order_id: options.order_id,
                payment_id: respo.razorpay_payment_id,
            },
            {headers: {'Authorization': token}})
            // and also showing on DOM
            alert('You are a Premium User Now')
            //removing the buy Premium button and replace it something else
            changeBuyPremium();
            // changing isPremium = true in JWT stored in local storage 
            let res = await axios.get('http://localhost:3000/user/makePremiumInLocalStorage',{
                headers:{'Authorization': token}
            })
            let newToken = res.data.token
            localStorage.setItem('token',newToken)
        }
    } 
    //before making new Razorpay obj we have to attach razorpay script
    // so that we can acess Razorpay from frontend
    const scrpt = document.createElement('script')
    scrpt.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.querySelector('body').appendChild(scrpt)
    // now making the new razorpay object
    const rzp1 = new Razorpay(options);
    rzp1.open();  // this will open razorpay front end

    rzp1.on('payment.failed',(res)=>{
        console.log(res)
        alert('something went wrong')
        // writing is info in database
        axios.post('http://localhost:3000/order/transectionFalied',{order_id:options.order_id},{headers:{'Authorization': token}})
    })
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
        // first checking if premium user and if is changing DOM accordingly
        checkingAndapplyingPremium()
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

function changeBuyPremium(){
    // making variable 'premium' = true
    premium = true;
    // removing buy premium button
    let btn = document.querySelector('.buyPremium')
    btn.remove()
    // adding a 'Premum User' tag
    let btnDiv = document.querySelector('.buyPremiumDiv');
    let newMsg = document.createElement('p')
    newMsg.innerText = 'Premium User'
    newMsg.className = 'premiumUser'
    btnDiv.appendChild(newMsg)
    // adding a show loaderboard button
    let leaderboardBtn = document.createElement('button');
    leaderboardBtn.innerText = 'Show Leaderboard';
    leaderboardBtn.className = 'leaderboardBtnClass';
    leaderboardBtn.addEventListener('click',showLeaderboard);
    btnDiv.appendChild(leaderboardBtn);

}

async function checkingAndapplyingPremium(){
    let token = localStorage.getItem('token')
    let result = await axios.get('http://localhost:3000/user/ispremium',{headers:{
        'Authorization':token
    }})
    if(result.data.isPremiumUser){
        changeBuyPremium();
    }
}

//-----showing leaderboard when pressing leaderboard button---//

async function showLeaderboard(e){
    const leaderboardUl = document.querySelector('#leaderboard')
    leaderboardUl.className = 'leaderboard'
    let response = await axios.get('http://localhost:3000/premium/getLeaderboard')
    let leaderboardArray = response.data.leaderboardArray
    // showing leaderboardArray on DOM
    leaderboardUl.innerHTML = '<h2>LeaderBoard :</h2>'
    leaderboardArray.forEach((entry)=>{
        let li = makeLeaderboardLi(entry.name , entry.expenses)
        leaderboardUl.appendChild(li)
    })
}

function makeLeaderboardLi(name,totalExpense){
    let li = document.createElement('li');
    li.className = 'leaderboardLi'
    li.innerText = `User - ${name} ,  Total Expenses - Rs${totalExpense}`
    return li
}