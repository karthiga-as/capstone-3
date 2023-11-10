$("input[type='checkbox']").on("click" , function() {
console.log(this.checked);
if(this.checked){
    $(this).siblings().addClass('checkText');
}else{
    $(this).siblings().removeClass('checkText');
}
   
//classList.add("pressed");
});
