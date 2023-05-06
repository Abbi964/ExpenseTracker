const emailInput = document.querySelector('#emailInput');
const form = document.querySelector('.form-class');
const prompt = document.querySelector('.prompt')
const Info = document.querySelector('.Info')

form.addEventListener('submit',submit)

async function submit(e){
    e.preventDefault()
    if(emailInput.value ===''){
        prompt.innerHTML = '<p>Please Fill the Email</p>'
        setTimeout(()=>prompt.innerHTML='',1000)
    }
    else{
        try{
            let obj = {email:emailInput.value}
            let result = await axios.post(`http://13.48.86.241:3000/password/forgotPassword`,obj);
            Info.innerHTML = `<p>${result.data.msg}</p>`
            
        }
        catch(err){
            console.log(err)
        }
    }
}