export function Email({value}){
  return <a href={'mailto:'+value}>{value}</a>;
}

export function Img({value}){
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="icon" src={value} alt={value}/>;
}