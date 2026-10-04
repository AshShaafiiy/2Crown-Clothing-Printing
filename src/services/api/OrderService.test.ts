import { describe,it,expect,vi,beforeEach } from 'vitest';
import { ApiOrderService } from './index';
import { getSubmittedOrder } from '../../utils/publicOrder';
const api=vi.hoisted(()=>vi.fn());vi.mock('./client',()=>({apiClient:api,setTokenProvider:vi.fn()}));
beforeEach(()=>api.mockReset());
const reference='2C-01234567-89ABCDEF-01234567-89ABCDEF';
describe('safe order API service',()=>{
 it('legacy phone stays JSON body; secure reference canonicalized/encoded',async()=>{api.mockResolvedValue(null);const service=new ApiOrderService();await service.getOrderByReference('2C-12345','09000000000');expect(api).toHaveBeenCalledWith('/orders/track',{method:'POST',body:JSON.stringify({reference:'2C-12345',phone:'09000000000'})});await service.getOrderByReference(reference.toLowerCase());expect(api).toHaveBeenLastCalledWith(`/orders/${reference}`);});
 it('keeps own submitted details for WhatsApp without reading PII from public response',async()=>{const input={customerName:'Own Name',customerPhone:'09000000000',items:[],subtotal:1000,discount:0,total:1000,status:'Awaiting Confirmation' as const,deliveryMethod:'pickup' as const};api.mockResolvedValue({reference,status:'Awaiting Confirmation',deliveryMethod:'pickup',deliveryFee:0,subtotal:1000,discount:0,total:1000,createdAt:'now',updatedAt:'now',items:[],history:[]});const saved=await new ApiOrderService().createOrder(input);expect(saved.customerPhone).toBe(input.customerPhone);expect(getSubmittedOrder(reference)).toEqual(saved);expect(saved.deliveryFee).toBe(0);expect(getSubmittedOrder('different')).toBeNull();});
});
