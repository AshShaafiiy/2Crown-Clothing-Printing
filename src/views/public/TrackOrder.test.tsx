// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import TrackOrder from './TrackOrder';
const lookup=vi.hoisted(()=>vi.fn());
vi.mock('../../services',()=>({services:{orders:{getOrderByReference:lookup}}}));
const reference='2C-01234567-89ABCDEF-01234567-89ABCDEF';
const order={reference,status:'Confirmed',deliveryMethod:'local',subtotal:1000,discount:0,total:1000,deliveryFee:null,createdAt:'2026-09-27T12:00:00Z',updatedAt:'2026-09-27T12:00:00Z',items:[{productName:'Shirt',quantity:1,price:1000}],history:[{newStatus:'Confirmed',timestamp:'2026-09-27T12:00:00Z'}]};
// A Vitest hook may return a cleanup function. Do not return the mock itself.
beforeEach(() => { lookup.mockReset(); });
afterEach(cleanup);
const submit=(value=reference)=>{fireEvent.change(screen.getByLabelText('Order Reference'),{target:{value}});fireEvent.click(screen.getByRole('button',{name:'Track Order'}));};
describe('public order tracking UI',()=>{
 it('renders safe DTO and manual delivery without phone for secure references',async()=>{lookup.mockResolvedValue(order);render(<TrackOrder/>);submit();expect(await screen.findByText('Order Details')).toBeTruthy();expect(screen.getByText('1x Shirt')).toBeTruthy();expect(screen.getByText('To be confirmed')).toBeTruthy();expect(screen.queryByLabelText('Phone Number')).toBeNull();expect(lookup).toHaveBeenCalledWith(reference,undefined);});
 it.each(['2C-FFFFFFFF-FFFFFFFF-FFFFFFFF-FFFFFFFF','bad'])('unknown/malformed%s produces safe error',async value=>{lookup.mockResolvedValue(null);render(<TrackOrder/>);submit(value);expect(await screen.findByText('Order not found.')).toBeTruthy();expect(screen.queryByText('Order Details')).toBeNull();});
 it('shows loading and blocks duplicate submission',async()=>{let resolve!:(data:any)=>void;lookup.mockReturnValue(new Promise(r=>{resolve=r;}));render(<TrackOrder/>);submit();expect((screen.getByRole('button',{name:'Searching...'}) as HTMLButtonElement).disabled).toBe(true);resolve(order);await screen.findByText('Order Details');});
 it('shows dedicated429 retry message',async()=>{lookup.mockRejectedValue({status:429});render(<TrackOrder/>);submit();expect(await screen.findByText('Too many tracking requests. Please try again later.')).toBeTruthy();});
 it('server failure hides internal error details',async()=>{lookup.mockRejectedValue(new Error('SQLITE private data'));render(<TrackOrder/>);submit();expect(await screen.findByText('An error occurred. Please try again.')).toBeTruthy();expect(screen.queryByText(/SQLITE/)).toBeNull();});
 it('legacy references require phone and send it through service argument',async()=>{lookup.mockResolvedValue(order);render(<TrackOrder/>);fireEvent.change(screen.getByLabelText('Order Reference'),{target:{value:'2C-12345'}});fireEvent.change(screen.getByLabelText('Phone Number'),{target:{value:'09000000000'}});fireEvent.click(screen.getByRole('button',{name:'Track Order'}));await screen.findByText('Order Details');expect(lookup).toHaveBeenCalledWith('2C-12345','09000000000');});
});
