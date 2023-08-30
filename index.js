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

// show AI tools in the UI
const showAiTools = (aiTools, isShowAll)=>{
    const cardsContainer = document.getElementById('cards-container');
    let aiToolsArray = aiTools.data.tools;
    if(!isShowAll) {
        aiToolsArray = aiToolsArray.slice(0,6);
    }
    cardsContainer.innerHTML = '';
    console.log(aiToolsArray);
        // loop through the ai tools
        aiToolsArray.forEach((aiTool)=>{
          
        const div = document.createElement('div'),
              featureArray = aiTool.features,
              publishDate = aiTool?.published_in;
                console.log(publishDate);
              let featureString ='';
              for(let feature of featureArray){
                    featureString += `<li>${feature}</li>`
              }
        div.className = 'card bg-base-100 shadow-xl'; 
        div.innerHTML = `
        <figure><img src=${aiTool?.image ? aiTool?.image : 'NO image'} alt="Image not found"/></figure>
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

// loading spinner
const toggleloadingSpinner = (isLoading)=>{
    const loadingSpinner = document.getElementById('loading-spinner');
    if(isLoading) {
        loadingSpinner.classList.remove('hidden')
    } else {
        loadingSpinner.classList.add('hidden');
    }
};

// show all btn function
const handleShowAllBtn = ()=>{
    const showAllBtn = document.getElementById('showAllBtn');
    loadData(true);
    showAllBtn.classList.add('hidden');

}

// show details btn function
const handleDetails = async (aiToolId)=>{
    const res = await fetch(`https://openapi.programming-hero.com/api/ai/tool/${aiToolId}`);
    const data = await res.json();
    const modalContainer = document.getElementById('modal-container');
   
    modalContainer.innerHTML = `
    <div>
        <dialog id="aiToolModal" class="modal">
            <form method="dialog" class="modal-box">
                <h3 class="font-bold text-lg">Hello!</h3>
                <p class="py-4">Press ESC key or click the button below to close</p>
                <div class="modal-action">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn">Close</button>
                </div>
            </form>
        </dialog>
    </div>
    `;
    aiToolModal.showModal()
    console.log(data.data);
}