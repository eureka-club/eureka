export default function(slug:string){
    const idstr = slug.match(/(\d*$)/);
    const id = idstr?.length ? +RegExp.$1 : -1;
    return id;
}