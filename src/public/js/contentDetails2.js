
const images = document.getElementById("productPreview")
const imgDetail = document.getElementById("imgDetails")

images.onclick = (e)=>{
    const el = e.target
    if(el.tagName === "IMG"){
        imgDetail.src = el.src
        console.log(el.src);
        
    }
    
    
}