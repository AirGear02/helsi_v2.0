function putToTimeRange(arrVisiting,start_time,end_time){
    if(arrVisiting.length==0)return false;
    console.log(arrVisiting)
    if(arrVisiting[0].start_time>start_time&&arrVisiting[0].start_time>end_time){
      return true;
      }
      else if(arrVisiting[arrVisiting.length-1].end_time<start_time){
      return true;
      }
      else{
      for(let i=0;i<arrVisiting.length-1;i++){
        if(arrVisiting[i].start_time==start_time){
          return false;
        }
        else if(i+1<=arrVisiting.length-1){
          if((arrVisiting[i].start_time<start_time&&arrVisiting[i].end_time<=start_time)
          &&(arrVisiting[i+1].start_time>start_time&&arrVisiting[i+1].start_time>=end_time)){
            return true;
          }
        }
      
      }}
      return false;
    
    
  }
  module.exports.putToTimeRange=putToTimeRange;