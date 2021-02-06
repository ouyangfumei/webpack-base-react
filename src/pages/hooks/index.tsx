import React, { useState,useEffect,useMemo,useContext,useCallback,useRef } from 'react';
import Child from './components/child';

export default function Example() {
  /**
   * 1.useState声明一个叫 "count" 的 state 变量
  */
  const [count, setCount] = useState(0);
  const [times,setTime] = useState(0);
  const [value,setValue] = useState('');


  /**
   * 2.useEffect副作用 传入[]时，类似componentDidMount 和 componentWillUnmount
   * 传入[count]，componentDidMount调用、count改变时调用
   * 2.1hooks要直接暴露在react下使用，不能再外面包裹if等，可以在里面包含if
   * 2.2如何清除useEffect副作用
   * 
  */
  useEffect(()=>{
      console.log('类似componentDidMount');
  },[])
  useEffect(() => {
    document.title = `You clicked ${count} times`;
    if(count === 0){//2.1
        console.log('useEffect if');
    }
  },[count]);
  useEffect(()=>{
    const timer = setInterval(() => {
        setTime(times+5)
    }, 1000);
    return ()=>clearInterval(timer);//2.2
  },[times])


  /**
   * 3.useMemo(做优化的) 把“创建”函数和依赖项数组作为参数传⼊ useMemo ，它仅会在某个依赖项改变时才重新计算
memoized 值。这种优化有助于避免在每次渲染时都进⾏⾼开销的计算
   * 本来expensive是函数的，此时调用改成了expensive（）===》 expensive 
  */
  const expensive = useMemo(()=>{
    console.log('expensive')
  },[count]) //只有count变化，这⾥才重新执⾏，如果没有提供依赖项数组，useMemo 在每次渲染时都会计算新的值。
//   const expensive = ()=>{
//     console.log('expensive')
//   }


  /**
   * 4.useCallback(做优化的)把内联回调函数及依赖项数组作为参数传⼊ useCallback ，它将返回该回调函数的 memoized 版本，
该回调函数仅在某个依赖项改变时才会更新
  */
  const addClick = useCallback(()=>{
      return `addClick${count}`
  },[count])
//   const addClick = ()=>{
//     return `addClick${count}`
//   }


 /**
  * 5.useRef 
  * 5.1 创建  const inputRef = useRef(); ref={inputRef}
  * 5.2 通过 ref获取值（inputRef.current ）.value
 */
  const inputRef = useRef();
  const getValByRef = ()=>{
    console.log(inputRef.current.value,'inputRef')
  }
  return (
    <div>
      <strong>1 useState</strong>
      <strong>2 useEffect</strong>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <br></br>
      <p>time:{times}</p>
      <strong>3 useMemo</strong>
      <strong>4 inputRef</strong>
      <input 
        ref={inputRef}
        value={value} 
        onChange={event => setValue(event.target.value)} />
      <button onClick={getValByRef}>通过useRef获取input的value</button>
      <p>expensive:{expensive}</p>
      <strong>5 useCallback</strong>
      <Child addClick={addClick}/>
    </div>
  );
}