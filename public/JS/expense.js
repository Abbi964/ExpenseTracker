const amount = document.getElementById('amountInput')
const category = document.getElementById('Category')
const description = document.getElementById('description')
const form = document.querySelector('.form-class')
const ulDiv = document.querySelector('.ul-div')
const expenseList = document.querySelector('.expenseList')
const incomeList = document.querySelector('.incomeList')
const prompt = document.querySelector('.prompt')
const noOfRows = document.getElementById('rowNoSelectorBtn')


form.addEventListener('submit',addExpenseOrincome);

async function addExpenseOrincome(e){
    e.preventDefault()
    if(amount.value==='' || category.value==='' || description.value===''){
        prompt.innerHTML = '<p>Please Fill all the fields</p>'
        setTimeout(()=>prompt.innerHTML='',1000)
    }
    else{
        try{
            // first checking expense on income which is selected
            let expenseOrIncome = 'expense';
            if(document.getElementById('income').checked){
                expenseOrIncome = 'income';
            }
            // making an obj of inputs and also token
            let expOrIncInfo = {
                amount:  amount.value, 
                category: category.value, 
                description:  description.value, 
                token:  localStorage.getItem('token')
            };
            // making a post request and returning id of expense or Income
            let response;
            let li;
            if(expenseOrIncome==='expense'){
                response = await axios.post(`http://13.49.68.137:3000/expense/addexpense`,expOrIncInfo);
                // making an list item
                li = makeLi(response.data, amount.value, category.value, description.value,'listItemExp');
            }
            else{
                response = await axios.post(`http://13.49.68.137:3000/income/addincome`,expOrIncInfo);
                // making an list item
                li = makeLi(response.data, amount.value, category.value, description.value,'listItemInc');
            }
            //Displaying expense in DOM
            
            // appending a delete btn
            let delBtn = makeDelBtn();
            li.appendChild(delBtn)
            // //appending edit button
            // let editBtn = makeEditBtn();
            // li.appendChild(editBtn)
            //appending li to ul
            if(expenseOrIncome==='expense'){
                expenseList.appendChild(li);
                // adding in total expense of user
                addToTotalExpense(amount.value)
            }
            else{
                console.log('adding income')
                incomeList.appendChild(li);
                // adding in total Income of user
                addToTotalIncome(amount.value)
            }
            // clearing the inputs
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
    let response = await axios.get(`http://13.49.68.137:3000/order/purchasePremium`,{headers:{'Authorization':token}})
    // making an object to pass as option in new razorpay obj which will be made
    let options = {
        "key":response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(respo){
            // handeler is CB fn which will be called by razorpay when payment will be successful
            console.log(respo)
            await axios.post(`http://13.49.68.137:3000/order/updateTransectionStatus`,{
                order_id: options.order_id,
                payment_id: respo.razorpay_payment_id,
            },
            {headers: {'Authorization': token}})
            // and also showing on DOM
            alert('You are a Premium User Now')
            //removing the buy Premium button and replace it something else
            changeBuyPremium();
            // changing isPremium = true in JWT stored in local storage 
            let res = await axios.get(`http://13.49.68.137:3000/user/makePremiumInLocalStorage`,{
                headers:{'Authorization': token}
            })
            let newToken = res.data.token
            localStorage.setItem('token',newToken)
        }
    } 
    
    // now making the new razorpay object
    var rzp1 = new Razorpay(options);
    rzp1.open();  // this will open razorpay front end
    e.preventDefault()

    rzp1.on('payment.failed',(res)=>{
        console.log(res)
        alert('something went wrong')
        // writing is info in database
        axios.post(`http://13.49.68.137:3000/order/transectionFalied`,{order_id:options.order_id},{headers:{'Authorization': token}})
    })
}

//-----modifying expenses using del and edit button---//
ulDiv.addEventListener('click',modifyExpense);

async function modifyExpense(e){
    //when del button is clicked
    if(e.target.className==='delBtn'){
        // if we clicked on del btn of expense list
        if(e.target.parentElement.parentElement.className==='expenseList'){
            try{
                // deleting expense from database
                let li_id = e.target.parentElement.id;
                let token = localStorage.getItem('token')
                let response = await axios.delete(`http://13.49.68.137:3000/expense/delete/${li_id}`,{
                    headers:{'Authorization':token}
                })
                // deleting from DOM
                let li = e.target.parentElement
                li.remove()
                // substating expense amount from totalexpense of user
                addToTotalExpense( -response.data.amount)
            }
            catch(err){
                console.log(err)
            }
        } 
        // if we clicked on del btn of income list
        else if(e.target.parentElement.parentElement.className==='incomeList'){
            try{
                // deleting income from database
                let li_id = e.target.parentElement.id;
                let token = localStorage.getItem('token')
                let response = await axios.delete(`http://13.49.68.137:3000/income/delete/${li_id}`,{
                    headers:{'Authorization':token}
                })
                // deleting from DOM
                let li = e.target.parentElement
                li.remove()
                // substating expense amount from totalexpense of user
                addToTotalIncome( -response.data.amount)
            }
            catch(err){
                console.log(err)
            }
        } 
    }
}

//-----loading all expenses when page is loded----///
window.addEventListener('DOMContentLoaded',loadExpensesAndIncome)

async function loadExpensesAndIncome(e){
    try{
        // first checking if premium user and if is changing DOM accordingly
        checkingAndapplyingPremium()
        //------------first loading all expense for page -------------------//
        let page = 1
        // getting all expenses from database of user logged for current page(using JWT)
        let token = localStorage.getItem('token')
        let response = await axios.get(`http://13.49.68.137:3000/expense/all_expenses?page=${page}`,{ 
            headers:{ 'Authorization': token },
            params:{noOfrows:localStorage.getItem('noOfRows')}
            })
        let expensesArray = response.data.expenses
        showListOnDOM(expensesArray,expenseList)
        //---------handaling pagination buttons------------------//
        paginate(response,'expensePageBtns')

        //--------now loading all incomes-----------------//
        // getting all income from database of user logged(using JWT)
        let incResponse = await axios.get(`http://13.49.68.137:3000/income/all_income?page=${page}`,{ 
            headers:{ 'Authorization': token },
            params:{noOfrows:localStorage.getItem('noOfRows')}
        })
        let incomeArray = incResponse.data.incomes
        showListOnDOM(incomeArray,incomeList)
        //------- handling pagination buttons------------//
        paginate(incResponse,'incomePageBtns')
    }
    catch(err){
        console.log(err)
    }
}

async function getExpensesAndShow(page){
    try{
        let token = localStorage.getItem('token')
        let response = await axios.get(`http://13.49.68.137:3000/expense/all_expenses?page=${page}`,{ 
            headers:{ 'Authorization': token },
            params:{noOfrows:localStorage.getItem('noOfRows')}
        })
        let expensesArray = response.data.expenses
        showListOnDOM(expensesArray,expenseList)
        paginate(response,'expensePageBtns')
    }
    catch(err){
        console.log(err)
    }
}

async function getIncomeAndShow(page){
    try{
        let token = localStorage.getItem('token')
        let response = await axios.get(`http://13.49.68.137:3000/income/all_income?page=${page}`,{ 
            headers:{ 'Authorization': token },
            params:{noOfrows:localStorage.getItem('noOfRows')}
        })
        let incomesArray = response.data.incomes
        showListOnDOM(incomesArray,incomeList)
        paginate(response,'incomePageBtns')
    }
    catch(err){
        console.log(err)
    }
}

function paginate(response,btnDivId){
    try{
        let buttonnDiv = document.getElementById(btnDivId)
            // if there is a previous page appending a btn for it
            if(response.data.havePreviousPage){
                let btnP = document.createElement('button')
                btnP.innerHTML = response.data.previousPage
                btnP.addEventListener('click',()=>{
                            // first clearing  list and pagination
                            if(btnDivId==='expensePageBtns'){
                                clearExpenseList()
                                clearPagination('expensePageBtns')
                                getExpensesAndShow(+response.data.previousPage)
                            }
                            else if(btnDivId==='incomePageBtns'){
                                clearIncomeList()
                                clearPagination('incomePageBtns')
                                getIncomeAndShow(+response.data.previousPage)
                            }
                        })
                buttonnDiv.appendChild(btnP)
            }
            // showing a btn for current page
            let btnC = document.createElement('button');
            btnC.className = 'currentPaginationBtn'
            btnC.innerHTML =  response.data.currentPage
            buttonnDiv.appendChild(btnC)
            // if there is a next page appending a btn for it
            if(response.data.haveNextPage){
                let btnN = document.createElement('button');
                btnN.innerHTML = response.data.nextPage;
                btnN.addEventListener('click',()=>{
                    // first clearing  list and pagination
                    if(btnDivId==='expensePageBtns'){
                        clearExpenseList()
                        clearPagination('expensePageBtns')
                        getExpensesAndShow(response.data.nextPage)
                    }
                    else if(btnDivId==='incomePageBtns'){
                        clearIncomeList()
                        clearPagination('incomePageBtns')
                        getIncomeAndShow(response.data.nextPage)
                    }
                })
                buttonnDiv.appendChild(btnN)
            }
    }
    catch(err){
        console.log(err)
    }
}

function showListOnDOM(array,list){
    array.forEach((exp)=>{
        //making an list item
        let li = makeLi(exp.id, exp.amount, exp.category, exp.description,'listItemExp');
        // appending a delete button
        let delBtn = makeDelBtn();
        li.appendChild(delBtn);
        // // appending an edit button
        // let editBtn = makeEditBtn(); 
        // li.appendChild(editBtn)
        //appending to ul
        list.appendChild(li)
    })
}


function makeLi(id,amount,category,description,className){
    let li = document.createElement('li');
    li.id = id
    li.className = className
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

function clearExpenseList(){
    expenseList.innerHTML = '<h3 style="color: #fd5454;" class="ul-h">EXPENSE</h3>'
}

function clearIncomeList(){
    incomeList.innerHTML = '<h3 style="color: rgb(61, 168, 2);" class="ul-h">INCOME</h3>'
}

function clearPagination(btnLiId){
    let pageBtns = document.getElementById(btnLiId)
    pageBtns.innerHTML = 'Page '
}

function addToTotalExpense(amount){
    let token = localStorage.getItem('token')
    axios.post(`http://13.49.68.137:3000/user/addToTotalExpense`,{
        amount:amount,
        token:token,
    })
}

function addToTotalIncome(amount){
    let token = localStorage.getItem('token')
    axios.post(`http://13.49.68.137:3000/user/addToTotalIncome`,{
        amount:amount,
        token:token,
    })
}

function changeBuyPremium(){
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
    let result = await axios.get(`http://13.49.68.137:3000/user/ispremium`,{headers:{
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
    let response = await axios.get(`http://13.49.68.137:3000/premium/getLeaderboard`)
    let leaderboardArray = response.data.leaderboardArray
    // showing leaderboardArray on DOM
    leaderboardUl.innerHTML = '<h2>LeaderBoard :</h2>'
    leaderboardArray.forEach((entry)=>{
        let li = makeLeaderboardLi(entry.name , entry.totalExpense)
        leaderboardUl.appendChild(li)
    })
}

function makeLeaderboardLi(name,totalExpense){
    let li = document.createElement('li');
    li.className = 'leaderboardLi'
    li.innerText = `User - ${name} ,  Total Expenses - Rs${totalExpense}`
    return li
}


//---------All Expense button---------------------------//
const AllExpBtn = document.getElementById('allExpenseButton')
AllExpBtn.addEventListener('click',(e)=>{
    let token = localStorage.getItem('token')
    window.location.href = `http://13.49.68.137:3000/premium/getAllExpensePage?token=${token}`
})

//----saving no of rows per page in local storage-------------//
noOfRows.addEventListener('change',(e)=>{
    localStorage.setItem('noOfRows',noOfRows.value)
})