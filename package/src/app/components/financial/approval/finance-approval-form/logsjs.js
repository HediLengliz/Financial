document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('logs-table');
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const actionCell = row.querySelector('td:nth-child(3)'); // "Action" is 3rd column
    const action = actionCell.textContent.trim().toLowerCase();

    if (action === 'soft-deleted') {
      actionCell.classList.add('action-soft-deleted');
    } else if (action === 'created') {
      actionCell.classList.add('action-created');
    } else if (action === 'restored') {
      actionCell.classList.add('action-restored');
    } else if (action === 'manager approved') {
      actionCell.classList.add('action-manager-approved');
    }
  });
});
function showRestoreConfirmation(id) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      <p>Are you sure you want to restore this item?</p>
      <button id="confirm-restore">Confirm</button>
      <button id="cancel-restore">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'block';
  document.getElementById('go-back-btn').addEventListener('click', () => {
    window.location.href = '/approval'; // Adjust URL to match your approval page
  });
  document.getElementById('confirm-restore').addEventListener('click', () => {
    restoreItem(id);
    modal.remove();
  });
  document.getElementById('cancel-restore').addEventListener('click', () => {
    modal.remove();
  });
}

function restoreItem(id) {
  fetch(`/api/logs/restore/${id}`, { method: 'POST' })
    .then(response => {
      if (response.ok) {
        // Update UI (e.g., change action to "restored" and refresh row)
        const row = document.querySelector(`button[data-id="${id}"]`).closest('tr');
        row.querySelector('td:nth-child(3)').textContent = 'restored';
        row.querySelector('td:nth-child(3)').className = 'action-restored';
        row.querySelector('td:last-child').innerHTML = ''; // Remove buttons
      } else {
        alert('Failed to restore item');
      }
    });
}

document.querySelectorAll('.restore-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');
    showRestoreConfirmation(id);
  });
});
