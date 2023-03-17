const emailInput = document.querySelector('#emailInput');
const form = document.querySelector('.form-class');
const prompt = document.querySelector('.prompt')

form.addEventListener('submit',submit)

function submit(e){
    e.preventDefault()
    if(emailInput.value ===''){
        prompt.innerHTML = '<p>Please Fill the Email</p>'
        setTimeout(()=>prompt.innerHTML='',1000)
    }
    else{
        let obj = {email:emailInput.value}
        axios.post('http://localhost:3000/password/forgotPassword',obj)
    }
}