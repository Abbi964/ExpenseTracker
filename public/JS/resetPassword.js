const passwordInput = document.querySelector('#passwordInput')
const form = document.querySelector('.form-class');
const prompt = document.querySelector('.prompt')
const info = document.querySelector('.Info')

form.addEventListener('submit',resetPassword)

async function resetPassword(e){
    e.preventDefault()
    if(passwordInput.value ===''){
        prompt.innerHTML = '<p>please fill email</p>';
        setTimeout(()=>prompt.innerHTML='',1000)
    }
    else{
        try{
            // making an object
            let obj = {password:passwordInput.value}
            // making a post request to /password/resetPassword
            let result = await axios.post(window.location.href,obj)
            // redirecting to login page
            alert('password has been reset successfully')
            window.location.href = `http://13.51.249.80:3000/user/login`
        }
        catch(err){
            console.log(err)
        }
    }
}