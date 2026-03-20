// Shared JS for case pages
function openModal() {
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}
function submitModal() {
  const phone = document.getElementById('mPhone').value.trim();
  if (!phone) { alert('Вкажіть номер телефону'); return; }
  document.getElementById('modalForm').style.display = 'none';
  document.getElementById('modalSuccess').style.display = 'block';
}
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
