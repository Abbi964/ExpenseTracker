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
            let response = await axios.post('http://localhost:3000/user/login',obj);
            // showing response on DOM
            loginInfo.innerHTML = `<p>${response.data}</p>`
        }
        catch(err){
            console.log(err)
        }
    }
}