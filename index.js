// loading spinner
const toggleloadingSpinner = (isLoading)=>{
    const loadingSpinner = document.getElementById('loading-spinner');
    if(isLoading) {
        loadingSpinner.classList.remove('hidden')
    } else {
        loadingSpinner.classList.add('hidden');
    }
};

// load data from API
const loadData = async (isShowAll) => {
    // loading spinner
    toggleloadingSpinner(true)
    const res = await fetch('https://openapi.programming-hero.com/api/ai/tools'),
          data = await res.json();
    // call show AI tools function
    showAiTools(data, isShowAll);
    // console.log(data.data.tools);
    
};
loadData();

// show AI tools in the UI
const showAiTools = (aiTools, isShowAll)=>{
    const cardsContainer = document.getElementById('cards-container');
    let aiToolsArray = aiTools.data.tools;
    
    if(!isShowAll) {
        aiToolsArray = aiToolsArray.slice(0,6);
    }
    cardsContainer.innerHTML = '';
        // loop through the ai tools
        aiToolsArray.forEach((aiTool,index)=>{
          
        const div = document.createElement('div'),
              featureArray = aiTool.features;
             
              let featureString ='';
              for(let feature of featureArray){
                    featureString += `<li>${feature}</li>`
              }
        div.className = 'card bg-base-100 shadow-xl'; 
        div.innerHTML = `
        <figure><img src=${index === 5 ? 'https://ashik-himel.github.io/ai-universe-hub/images/image_not_available.png' : aiTool.image} alt=""/></figure>
        <div class="card-body">
                <h2 class="card-title">Features</h2>
                <ol class="list-decimal">${featureString}</ol>
            <div class="flex justify-between items-center">
                <h2 class="card-title">${aiTool.name}</h2>
                <div class="card-actions justify-end">
                  <button onclick="handleDetails('${aiTool.id}')" class="btn text-red-500"><i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <i class="far fa-calendar-alt"></i>
                <p>${aiTool?.published_in}</p>
            </div>
        </div>
        `;
        cardsContainer.appendChild(div);
    });

    // hide loading spinner
    toggleloadingSpinner(false);
};


// show all btn function
const handleShowAllBtn = ()=>{
    const showAllBtn = document.getElementById('showAllBtn');
    loadData(true);
    showAllBtn.classList.add('hidden');
}

// show details MODAL function
const handleDetails = async (aiToolId)=>{
    const res = await fetch(`https://openapi.programming-hero.com/api/ai/tool/${aiToolId}`);
    const data = await res.json();
    const modalContainer = document.getElementById('modal-container');
    const trimData = data.data;
    console.log(trimData);
    console.log(trimData.accuracy.score);
    console.log('hello');
    modalContainer.innerHTML = `
    <div>
        <dialog id="aiToolModal" class="modal">
            <form method="dialog" class="modal-box w-11/12 max-w-5xl max-h-5xl">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <div class="flex flex-col-reverse items-center justify-center gap-4 md:flex-row">
                    <div class="border-2 p-4 w-[400px] border-red-200 bg-red-100 rounded-lg">
                        <h3 class="text-lg font-semibold p-2">${trimData?.description || 'No data available'}</h3>
                        <div class="flex justify-center gap-2">
                            <div class="w-20 p-2 text-xs bg-white text-green-700 font-semibold rounded-lg"><h3 class="text-center"><span>${trimData?.pricing[0]?.price || 'No data available'}</span> ${trimData?.pricing[0]?.plan || 'No data available'}</h3></div>

                            <div class="w-20 p-2 text-xs break-words bg-white text-orange-500 font-semibold rounded-lg"><h3 class="text-center"><span>${trimData?.pricing[1]?.price || 'No data available'}</span> ${trimData?.pricing[1]?.plan || 'No data available'}</h3></div>

                            <div class="w-20 p-2 text-xs break-words bg-white text-red-600 font-semibold rounded-lg"><h3 class="text-center"><span>Contact us</span> ${trimData?.pricing[2]?.plan || 'No data available'}</h3></div>
                        </div>
                        <div class="flex items-center justify-around my-4">
                            <div>
                                <h3 class="font-bold text-lg">Features</h3>
                                <ul class="list-disc ml-6 text-sm text-gray-500">
                                    <li>${trimData?.features[1]?.feature_name || 'No data available'}</li>
                                    <li>${trimData?.features[2]?.feature_name || 'No data available'}</li>
                                    <li>${trimData?.features[3]?.feature_name || 'No data available'}</li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg">Integrations</h3>
                                <ul class="list-disc ml-6 text-sm text-gray-500">
                                    <li>${trimData?.integrations[0] || 'No data available'}</li>
                                    <li>${trimData?.integrations[1] || 'No data available'}</li>
                                    <li>${trimData?.integrations[2] || 'No data available'}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="p-4 border-2 rounded-lg w-[400px]">
                            <div class="text-right mr-28">
                                <div class="badge badge-error gap-2 absolute mt-2 text-white">
                               ${trimData?.accuracy?.score*100}% accuracy
                                </div>
                            </div>
                            <img class="rounded-lg" src="${trimData?.image_link[0] || 'No data available'}" alt="">
                            <div class="text-center p-1">
                                <h3 class="text-lg font-bold my-1">${trimData?.input_output_examples[1]?.input || 'No data available'}</h3>
                                <p>${trimData.input_output_examples[1]?.output || 'No data available'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </dialog>
    </div>
    `;
    aiToolModal.showModal()
}

// sort data based of release date
const handleSortData = async()=>{
    const res = await fetch('https://openapi.programming-hero.com/api/ai/tools');
    const data = await res.json(),
          aiToolsArray = data.data.tools,
          cardsContainer = document.getElementById('cards-container');
      
     const customSort = (a,b)=>{
         const dateA = new Date(a.published_in);
         const dateB = new Date(b.published_in);
         if(dateA > dateB) return 1;
         else if(dateA < dateB) return -1;
         return 0; 
     };
     let sortedDatesAiTools = aiToolsArray.sort(customSort);
    //  remove the show all button
  

    // clear the card container
     cardsContainer.innerHTML = '';
    //  loop through all the sorted elements
     sortedDatesAiTools.forEach((aiTool,index)=>{
          
        const div = document.createElement('div'),
              featureArray = aiTool.features;
             
              let featureString ='';
              for(let feature of featureArray){
                    featureString += `<li>${feature}</li>`
              }
        div.className = 'card bg-base-100 shadow-xl'; 
        div.innerHTML = `
        <figure><img src=${index === 10 ? 'https://ashik-himel.github.io/ai-universe-hub/images/image_not_available.png' : aiTool.image} alt="Image not found"/></figure>
        <div class="card-body">
                <h2 class="card-title">Features</h2>
                <ol class="list-decimal">${featureString}</ol>
            <div class="flex justify-between items-center">
                <h2 class="card-title">${aiTool.name}</h2>
                <div class="card-actions justify-end">
                  <button onclick="handleDetails('${aiTool.id}')" class="btn text-red-500"><i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <i class="far fa-calendar-alt"></i>
                <p>${aiTool?.published_in}</p>
            </div>
        </div>
        `;
        cardsContainer.appendChild(div);
    });    
};