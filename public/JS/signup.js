const form = document.querySelector('.form-class')
const nameInput = document.querySelector('#nameInput')
const emailInput = document.querySelector('#emailInput')
const passwordInput = document.querySelector('#passwordInput')
const prompt = document.querySelector('.prompt')
const signUpInfo = document.querySelector('.signUpInfo')

form.addEventListener('submit',SubmitForm);

async function SubmitForm(e){
    e.preventDefault()
    if(nameInput.value==='' || emailInput.value==='' || passwordInput.value===''){
        prompt.innerHTML = '<p>Please Fill All The Fields</p>'
        setTimeout(()=>prompt.innerHTML='',1000)
    }
    else{
        try{
            // making an obj with input values
            let obj = {name:nameInput.value, email:emailInput.value, password:passwordInput.value}
            // posting obj to database
            let response = await axios.post('http://localhost:3000/user/signup',obj);
            if(response.data===false){
                signUpInfo.innerHTML = '<p>User with this email already exists</p>'
            }
            else{
                signUpInfo.innerHTML = '<p>You have been signed up</p>';
                // clearing inputs
                nameInput.value = '';
                emailInput.value = '';
                passwordInput.value = '';
            }
        }
        catch(err){
            console.log(err)
        }
    }
}