(async ()=>{

    try{

        let res = await fetch('http://localhost:3000/products');

        if(!res.ok){

            throw new Error(res.status);

        }

        let req = await res.json();
        console.log(req)

    }catch(e){

        console.error(e)
    }
    
})()



async function post() {

    try{

        let req =  await fetch('http://localhost:3000/products',
            {

                method:'post',
                headers:{'Content-Type': 'application/json'},
                // body:JSON.stringify({title:'test',price:1222,description:'test'})
                body:JSON.stringify({title:'test',price:1222,description:'test'})

            })
            if(!req.ok){
                throw new Error(req.status)
            }

            let res = await req.json();
            console.log(res)
    }catch(e){

        console.error(e)
        
    }
    
}




async function Delete(id) {



    try{
        let req = await fetch("http://localhost:3000/products/"+id,{
            method:'delete'
        })


        if(!req.ok){

            throw new Error(req.status)
        }

        let res = await req.json();
        console.log(res)

    }catch(e){

        console.error(e)

    }

    
}




//patch

async function patch(id) {


    try{


        let req = await fetch('http://localhost:3000/products/'+id,{
            method:'patch',
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({title:'test',price:1222,description:'test test test test'})
        });

        if(!req.ok){

            throw new Error(req.status)
        }

        console.log("done edit")
        console.log(req.json())


    }catch(e){

    }

}

patch(8466)
