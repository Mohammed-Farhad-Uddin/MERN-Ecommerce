import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import './Search.css';

const Search = () => {
    const [keyword,setKeyword]=useState("");
    const history = useHistory();

    const searchSubmitHandler=(e)=>{
        e.preventDefault(); 
        if(keyword.trim()){//keyword.trim() takle keyword er bitore string er aghe ba pore extra space takle oita remove hoye jabe("    hello world   "="hello world")...trim korle space remove hoye jai shuru te ba ses er extra space dile oi ta.
            history.push(`/products/${keyword}`)
        } else{
            history.push('/products')
        }
    };

    return (
        <>
        <MetaData title= "Search Product"/>
            <form className="searchBox" onSubmit={searchSubmitHandler}>
                <input
                type="text"
                placeholder="Search a Product"
                onChange={(e)=>setKeyword(e.target.value)}
                />
                <input type="submit" value="search"/>
            </form>
        </>
    );
};

export default Search;