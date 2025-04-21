const validateEditData=(req)=>{
    const validInput = ['firstName','lastName','about','photo','skills','age','gender']
    let valid_check = true
   let nnn =  Object.keys(req).forEach(element => {
        if((!validInput.includes(element))){
            valid_check = false
        }
        
    })
    nnn

   return valid_check

}
module.exports = {validateEditData:validateEditData}