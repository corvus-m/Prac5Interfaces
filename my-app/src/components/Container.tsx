import react, { FC, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled'

import '../styles/Container.css';

// type buttonValues ={
//     pagActual
// }

type characters = {
    characters: {
        results: Array< { name: string }>
    }
}

type charAndPages = {
    characters: {

        info: {pages:number};
        results: Array< { name: string }>
    }
}
//esto se suele poner en mayusculas
//si se pone result en  vez de results, no funciona y sale el error de Oh no, ERROR :(
const GET_CHARACTERS = gql`
    query characters {
        characters {
            results{
                name
            }
        }
    }
`;


const GET_PAGE = gql`
# Write your query or mutation here
    query characters($jamon: Int) {
        characters(page: $jamon) {
   		 info{
    		  pages
   		 }
            results{
                name
            }
        }
    }
    
`;




const Container: FC = () => {

    // los hooks son funciones especiales de reacrt qu cuando hacen algo recargan el componente
    // el orden da igual pero los nombres tiene que ser siempre esos
    // data: dataCharacters es para poder poner otro nombre diferente a la variable que se le pasa
    //refetch: para que se vuelva a ejecutar la query
   // const { data, loading, error, refetch } = useQuery<characters>(GET_CHARACTERS);// ejecuta la query, mientras la query se este ejecutandose, loading a true, data undefined y error undefined, cuando se ha ejecutado: loading a false, data con los resultados de la query y error undefined

   const [pagina, setPagina] = useState <number> (1);

    const { data, loading, error, refetch } = useQuery<charAndPages>(GET_PAGE, {
        variables: {
            jamon: pagina
        },
        // ya esta por default
        // fetchPolicy: "cache-and-network",

    });
    if (loading) {
        return <div>Cargando....</div>
    }
    if (error) {
        return <div>Oh no, ERROR :(</div>
    }

    const total : number = data?.characters.info.pages? data?.characters.info.pages: 0;
    return (
        <div>
            {/* <input  type="button"  onClick={()=> setPagina(pagina+1)}> - </input>
            <input  type="button"  onClick={()=> setPagina(pagina-1)}>  &#61; </input> */}
            
            {/* <div className='pagination' > */}
            <SimpleButton onClick={()=> setPagina(pagina-1)}> &lt;</SimpleButton>

            <MiBoton  nombre="extremo" total={total} onClick={() => setPagina(1)} boton={1} pagina={pagina} > 1</MiBoton>
            <ThreePoints total = {total}  boton={1} pagina={pagina}> ...</ThreePoints>


            {/* numeros */}
            {/* <a type="button" onClick={()=> setPagina(pagina-2)}> {pagina-2}</a> */}
            
            <MiBoton boton={pagina-1} total={total} nombre="masmenos" onClick={()=> setPagina(pagina-1)}  pagina={pagina}> {pagina-1}</MiBoton>
            <MiBoton boton={pagina} total={total} nombre="centro" pagina={pagina} > {pagina}</MiBoton>
            <MiBoton boton={pagina + 1} total={total} nombre="masmenos" onClick={() => setPagina(pagina + 1)} pagina={pagina}>{pagina+1}</MiBoton>


            
            <ThreePoints total= {total}  boton={2} pagina={pagina}> ...</ThreePoints>
            <MiBoton  nombre="extremo" total={total} boton={total} pagina={pagina} onClick={()=> data?.characters.info.pages?setPagina(data?.characters.info.pages):setPagina(pagina)}> {data?.characters.info.pages}</MiBoton>
            <SimpleButton    onClick={()=> setPagina(pagina+1)}> &gt;</SimpleButton>
            {/* </div> */}
           
            {/* {for(variable i:number; i< data?.characters.info.pages; i=i+1){(num:number) => (<button>{num}</button>)} } */}
         

            <br/> <br/> <br/>
            <div>
            {data?.characters.results.map((c) => (
                <div>{c.name}</div>

                
                
            ))}
            </div>
        </div>
    );
}


const ThreePoints = styled.div<{boton:number, total:number, pagina:number}>`
/* 
    background-color: red;
    color:  purple; */

    display :  ${({boton, total, pagina}) => {
         if (boton===1 ){
            if ( pagina >3) return"inline-block" ;
            else return "none";
        }
  
        if (boton===2 ){
            if ( pagina <total-2) return"inline-block" ;
            else return "none";
        }
    }
        
        };;
    margin: 0 6px;
    color: black;
    float: left;
    padding: 8px 16px;
    text-decoration: none;
    /* transition: background-color .3s;
    border: 1px solid #ddd; */
    text-decoration: none;

    &.active {
        background-color: #4CAF50;
        color: white;
    }

    /* &:hover:not(.active) {
        background-color: #28528e;
        color: white;
  } */
    
`

const SimpleButton = styled.button`
margin: 0 4px;
color: black;
float: left;
padding: 8px 16px;
text-decoration: none;
transition: background-color .3s;
border: 1px solid #ddd;
text-decoration: none;

&.active {
    background-color:  #2fb7c9;
    color: white;
}

&:hover:not(.active) {
    background-color: #2d6fcd;;
    color: white;
}

`

//añadir total:number para paginado dinamico
const MiBoton = styled.button<{boton:number, total:number, nombre:string, pagina:number}>`
/* 
    background-color: red;
    color:  purple; */

    display :  ${({boton, total, nombre, pagina}) => {
        if(nombre === "centro") {
            if (pagina === 1 || pagina === total) return "none";//descartamos los finales
            return"inline-block" ; 
        } 
        else

        if(nombre === "masmenos") {
            if (boton <= 1 || boton >=  total) return "none";//descartamos los finales
            return"inline-block" ; 
        } 
        else
        
        if(boton === 1 || boton === total )
        return"inline-block" ;
        else
        return "none";
    }
        
        };;


background-color: ${({boton,pagina}) => {if (boton===pagina)return "#4CAF50";
    else return;}};
    margin: 0 4px;
    color: black;
    float: left;
    padding: 8px 16px;
    text-decoration: none;
    transition: background-color .3s;
    border: 1px solid #ddd;
    text-decoration: none;

    &.active {
        background-color: #2fb7c9;
        color: white;
    }

    &:hover:not(.active) {
        background-color: #2d6fcd;;
        color: white;
  }
    
`

export default Container;