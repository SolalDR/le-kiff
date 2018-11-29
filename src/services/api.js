class API {

  static call(url){
    fetch(url)
    .then(res => res.json())
    .then(
      
      (result) => {

        console.log("helloe", result);
        // this.setState({
        //   isLoaded: true,
        //   items: result.items
        // });
      },

      (error) => {
        // this.setState({
        //   isLoaded: true,
        //   error
        // });
      }
        
    )
  }

}

export default API;
