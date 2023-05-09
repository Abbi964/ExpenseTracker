const form = document.querySelector('.form-class')
const nameInput = document.querySelector('#nameInput')
const emailInput = document.querySelector('#emailInput')
const passwordInput = document.querySelector('#passwordInput')
const prompt = document.querySelector('.prompt')
const loginInfo = document.querySelector('.loginInfo')

form.addEventListener('submit',SubmitForm);

async function SubmitForm(e){
    e.preventDefault()
    if(emailInput.value==='' || passwordInput.value===''){
        prompt.innerHTML = '<p>Please Fill All The Fields</p>'
        setTimeout(()=>prompt.innerHTML='',1000)
    }
    else{
        try{
            // making an obj containing login info
            let obj = {email:emailInput.value, password:passwordInput.value};
            // making a post request
            let response = await axios.post(`http://13.48.23.186:3000/user/login`,obj);
            // going to main page if we get a response
            alert(response.data.msg)
            // saving the json web token in local storage
            localStorage.setItem('token',response.data.token)
            // also saving noOfRows in localstorage 
            localStorage.setItem('noOfRows','3')
            window.location.href = '/expense/main'
        }
        catch(err){
            // showing errs on DOM
            loginInfo.innerHTML = `<p>${err.response.data.msg}</p>`
        }
    }
}

const forgotPassword = document.querySelector('.forgotPassword');

forgotPassword.addEventListener('click',getResetPassword)

function getResetPassword(e){
    window.location.href = '/password/forgotpassword'
}