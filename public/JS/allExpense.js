const table = document.getElementById('table');
const downloadBtn = document.getElementById('download');
const downloadedFilesUl = document.getElementById('downloadedFiles');
const warning = document.getElementById('warning')


window.addEventListener('DOMContentLoaded',loadTableAndFileUrls)

async function loadTableAndFileUrls(e){
    try{
        //-------loading table ------------------------//

        let urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get('token');
        let result = await axios.get(`http://13.50.99.26:3000/premium/getAllExpenses`,{ headers:{ 'Authorization': token }})
        let count = 0
        // first appending all incomes to table
        result.data.incomeArray.forEach((inc)=>{
            count = count + 1
            let tr = document.createElement('tr')
            tr.innerHTML = `<td>${count}</td><td>${inc.createdAt}</td><td>${inc.category}</td><td>${inc.description}</td><td>${inc.amount}</td><td></td>`
            table.appendChild(tr)
        })
        // Now appending all Expenses to table
        result.data.expenseArray.forEach((exp)=>{
            count = count + 1
            let tr = document.createElement('tr')
            tr.innerHTML = `<td>${count}</td><td>${exp.createdAt}</td><td>${exp.category}</td><td>${exp.description}</td><td></td><td>${exp.amount}</td>`
            table.appendChild(tr)
        })

        //----------------loading fileUrls--------------------------//
        let response = await axios.get(`http://13.50.99.26:3000/user/getFileUrls`,{headers:{'Authorization':token}})
        let fileUrlsArray = response.data.downloadedFiles
        let index = 1
        fileUrlsArray.forEach((ele)=>{
            let li = document.createElement('li');
            li.innerHTML = `<a href="${ele.url}">File ${index}</a> Downloaded on ${ele.createdAt}`
            downloadedFilesUl.appendChild(li)
            index = index + 1
        })

    }
    catch(err){
        warning.textContent = 'some error occurd'
        console.log(err)
    }
    
}

//----- download button for downloading expenses--------///

downloadBtn.addEventListener('click',download);

async function download(e){
    try{
        let urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get('token');
        let result = await axios.get(`http://13.50.99.26:3000/user/download`,{headers:{ 'Authorization': token }})
         //saving fileUrl in DB
         let response = await axios.post(`http://13.50.99.26:3000/user/saveFileUrl`,{fileUrl:result.data.fileUrl},{headers:{ 'Authorization': token }})
         console.log(response)
        // Now downloading the file using fileurl
        let a = document.createElement('a')
        a.href = result.data.fileUrl
        a.download = 'myexpenses.csv'
        a.click()
       
    }
    catch(err){
        console.log(err)
        window.alert(err.message)
    }
}