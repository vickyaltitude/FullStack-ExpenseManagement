
async function feedData(){

    const fetchdata = await fetch('http://43.204.237.132/premium/getpremiumdata');
    const parsedData = await fetchdata.json();
    console.log(parsedData);
    loadData(parsedData.data);

}

feedData()


function loadData(dat){

    let trEle = document.getElementById('t-body');

     for(let i = 0;i<dat.length;i++){
         let newtr = document.createElement('tr');
         newtr.innerHTML = `<td>${dat[i].name}</td>
                         <td>${dat[i].total_expense}</td>`;
         trEle.appendChild(newtr);
     }

 }
 