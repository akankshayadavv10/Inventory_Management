import api from './client'
import mock from '../data/mockInventory.json'
export async function getInventory(){
  try{ const res = await api.get('/api/inventory'); return normalize(res.data) }catch(e){ return normalize(mock) }
}
export async function addItem(payload){ try{ const res = await api.post('/api/inventory', payload); return res.data }catch(e){ const id=Date.now(); return { id, ...payload } } }
export async function updateItem(id,payload){ try{ const res=await api.put(`/api/inventory/${id}`, payload); return res.data }catch(e){ return { id, ...payload } } }
export async function deleteItem(id){ try{ await api.delete(`/api/inventory/${id}`) }catch(e){} }
function normalize(data){ return data.map(d=>({ id: d.id ?? d._id, name:d.name, description:d.description??'', category:d.category, quantity:Number(d.quantity), minQuantity:Number(d.minQuantity), price:Number(d.price), supplier:d.supplier??'', location:d.location??'', lastUpdated:d.lastUpdated??new Date().toISOString().slice(0,10) })) }