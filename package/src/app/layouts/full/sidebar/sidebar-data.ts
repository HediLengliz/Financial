import { NavItem } from './nav-item/nav-item';
import {ProjectComponent} from "../../../components/project/project.component";

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
    bgcolor: 'primary',
  },
  {
    displayName: 'Projects', // Added entry
    iconName: 'apps',
    route: '/projects',
    bgcolor: 'success',
    chip: true,
    chipClass: 'bg-primary text-white',
  },
  {
    displayName: 'Financial', // Added entry for Financial
    iconName: 'credit-card',
    route: '', // No direct route for Financial, it's a dropdown
    bgcolor: 'success',
    chip: true,
    chipClass: 'bg-primary text-white',
    children: [
      {
        displayName: 'Budget',
        iconName: 'notebook',
        route: '/financial/budget',  // Adjust this route as needed
        chip: true,
        chipClass: 'bg-primary text-white',
        bgcolor: 'warning',

      },
      {
        displayName: 'Invoice',
        iconName: 'file-invoice',
        route: '/financial/invoice',  // Adjust this route as needed
        chip: true,
        chipClass: 'bg-primary text-white',
        bgcolor: 'primary',
      },
      {
        displayName: 'Approval',
        iconName: 'check',
        route: '/financial/approval',  // Direct to dashboard
        chip: true,
        chipClass: 'bg-primary text-white',
        bgcolor: 'secondary'
      },
      {
        displayName: 'Expense',
        iconName: 'credit-card',
        route: '/financial/expense',  // Adjust this route as needed
        chip: true,
        chipClass: 'bg-primary text-white',
        bgcolor: 'alert',
      },
    ],
  },

  {
    navCap: 'Apps',
  },
  {
    displayName: 'Chat',
    iconName: 'message-dots',
    route: 'https://spike-angular-pro-main.netlify.app/apps/chat',
    bgcolor: 'success',
    chip: true,
    external: true,
    chipClass: 'bg-primary text-white',
  },
  {
    displayName: 'Calendar',
    iconName: 'calendar',
    route: 'https://spike-angular-pro-main.netlify.app/apps/calendar',
    bgcolor: 'error',
    chip: true,
    external: true,
    chipClass: 'bg-primary text-white',
  },
  {
    displayName: 'Email',
    iconName: 'mail',
    route: 'https://spike-angular-pro-main.netlify.app/apps/email/inbox',
    bgcolor: 'primary',
    chip: true,
    external: true,
    chipClass: 'bg-primary text-white',
  },

  {
    displayName: 'Kanban',
    iconName: 'checklist',
    route: 'https://spike-angular-pro-main.netlify.app/apps/kanban',
    bgcolor: 'warning',
    chip: true,
    external: true,
    chipClass: 'bg-primary text-white',
  },
  {
    displayName: 'Contacts',
    iconName: 'phone',
    route: 'https://spike-angular-pro-main.netlify.app/apps/contacts',
    bgcolor: 'success',
    chip: true,
    external: true,
    chipClass: 'bg-primary text-white',
  },

  {
    displayName: 'Employee',
    iconName: 'brand-ctemplar',
    route: 'https://spike-angular-pro-main.netlify.app/apps/employee',
    bgcolor: 'secondary',
    chip: true,
    external: true,
    chipClass: 'bg-primary text-white',
  },
  {
    displayName: 'Notes',
    iconName: 'note',
    route: 'https://spike-angular-pro-main.netlify.app/apps/notes',
    bgcolor: 'warning',
    chip: true,
    external: true,
    chipClass: 'bg-primary text-white',
  },
  {
    displayName: 'Tickets',
    iconName: 'ticket',
    route: 'https://spike-angular-pro-main.netlify.app/apps/tickets',
    bgcolor: 'success',
    chip: true,
    external: true,
    chipClass: 'bg-primary text-white',

  },
  {
    displayName: 'ToDo',
    iconName: 'edit',
    route: 'https://spike-angular-pro-main.netlify.app/apps/todo',
    bgcolor: 'error',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
  },
  /*
  {
    displayName: 'Invoice',
    iconName: 'file-invoice',
    bgcolor: 'primary',
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
    route: '',
    children: [
      {
        displayName: 'List',
        iconName: 'point',
        bgcolor: 'tranparent',
        external: true,
        chip: true,
        chipClass: 'bg-primary text-white',
        chipContent: 'PRO',
        route: 'https://spike-angular-pro-main.netlify.app/apps/invoice',
      },
      {
        displayName: 'Detail',
        iconName: 'point',
        bgcolor: 'tranparent',
        external: true,
        chip: true,
        chipClass: 'bg-primary text-white',
        chipContent: 'PRO',
        route:
          'https://spike-angular-pro-main.netlify.app/apps/viewInvoice/101',
      },
      {
        displayName: 'Create',
        iconName: 'point',
        bgcolor: 'tranparent',
        external: true,
        chip: true,
        chipClass: 'bg-primary text-white',
        chipContent: 'PRO',
        route: 'https://spike-angular-pro-main.netlify.app/apps/addInvoice',
      },
      {
        displayName: 'Edit',
        iconName: 'point',
        bgcolor: 'tranparent',
        external: true,
        chip: true,
        chipClass: 'bg-primary text-white',
        chipContent: 'PRO',
        route:
          'https://spike-angular-pro-main.netlify.app/apps/editinvoice/101',
      },
    ],
  },*/

  /*
  {
    navCap: 'Ui Components',
  },
  {
    displayName: 'Badge',
    iconName: 'archive',
    route: '/ui-components/badge',
    bgcolor: 'warning',
  },
  {
    displayName: 'Chips',
    iconName: 'info-circle',
    route: '/ui-components/chips',
    bgcolor: 'success',
  },
  {
    displayName: 'Lists',
    iconName: 'list-details',
    route: '/ui-components/lists',
    bgcolor: 'error',
  },
  {
    displayName: 'Menu',
    iconName: 'file-text',
    route: '/ui-components/menu',
    bgcolor: 'primary',
  },
  {
    displayName: 'Tooltips',
    iconName: 'file-text-ai',
    route: '/ui-components/tooltips',
    bgcolor: 'secondary',
  },
  {
    displayName: 'Forms',
    iconName: 'clipboard-text',
    route: '/ui-components/forms',
    bgcolor: 'warning',
  },
  {
    displayName: 'Tables',
    iconName: 'table',
    route: '/ui-components/tables',
    bgcolor: 'success',
  },
  {
    displayName: 'Expansion Panel',
    iconName: 'layout-bottombar-inactive',
    route: 'https://spike-angular-pro-main.netlify.app/ui-components/expansion',
    bgcolor: 'error',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
  }, */


  /*
  {
    displayName: 'Progress Bar',
    iconName: 'progress',
    route: 'https://spike-angular-pro-main.netlify.app/ui-components/progress',
    bgcolor: 'success',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
  },
  {
    displayName: 'Progress Spinner',
    iconName: 'rotate-2',
    route: 'https://spike-angular-pro-main.netlify.app/ui-components/progress-spinner',
    bgcolor: 'error',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
  },
  {
    displayName: 'Ripples',
    iconName: 'ripple',
    route: 'https://spike-angular-pro-main.netlify.app/ui-components/ripples',
    bgcolor: 'primary',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
  },
  {
    displayName: 'Slide Toggle',
    iconName: 'toggle-left',
    route: 'https://spike-angular-pro-main.netlify.app/ui-components/slide-toggle',
    bgcolor: 'secondary',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
  },
  {
    displayName: 'Slider',
    iconName: 'adjustments-alt',
    route: 'https://spike-angular-pro-main.netlify.app/ui-components/slider',
    bgcolor: 'warning',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
  },
  {
    displayName: 'Snackbar',
    iconName: 'stack-backward',
    route: 'https://spike-angular-pro-main.netlify.app/ui-components/snackbar',
    bgcolor: 'success',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
  },
  {
    displayName: 'Tabs',
    iconName: 'border-all',
    route: 'https://spike-angular-pro-main.netlify.app/ui-components/tabs',
    bgcolor: 'error',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
  },
  {
    displayName: 'Toolbar',
    iconName: 'tools-kitchen',
    route: 'https://spike-angular-pro-main.netlify.app/ui-components/toolbar',
    bgcolor: 'primary',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
  },
  {
    displayName: 'Tooltips',
    iconName: 'tooltip',
    route: 'https://spike-angular-pro-main.netlify.app/ui-components/tooltips',
    bgcolor: 'secondary',
    external: true,
    chip: true,
    chipClass: 'bg-primary text-white',
    chipContent: 'PRO',
  },
  */





];
