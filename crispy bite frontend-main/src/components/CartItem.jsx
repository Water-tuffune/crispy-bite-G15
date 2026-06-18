import { Trash2 } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

const CartItem = ({ item, onUpdate, onRemove }) => (
  <div className="d-flex gap-3 align-items-center border-bottom py-3">
    <img className="rounded" src={item.image || "https://placehold.co/96x72?text=Food"} alt={item.item_name} width="96" height="72" />
    <div className="flex-grow-1">
      <strong>{item.item_name}</strong>
      <div className="small text-muted">{formatCurrency(item.price)} each</div>
    </div>
    <input
      className="form-control"
      style={{ width: 86 }}
      type="number"
      min="1"
      value={item.quantity}
      onChange={(event) => onUpdate(item.id, event.target.value)}
    />
    <strong style={{ width: 90 }}>{formatCurrency(item.subtotal)}</strong>
    <button className="btn btn-outline-danger btn-sm" onClick={() => onRemove(item.id)} aria-label="Remove item">
      <Trash2 size={16} />
    </button>
  </div>
);

export default CartItem;
