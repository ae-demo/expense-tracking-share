import { useState, type ReactNode } from "react";
import {
  Alert, AppShell, Breadcrumbs, Button, Detail, Dialog, EmptyState, Field, Filters, Form, Heading,
  Screen, Section, Stack, Stat, StatGroup, Table, Text, ValidationSummary, defineApp, useCollection,
  useDisplayState, useNav, useParams, useToday,
} from "@wso2/prototype-kit";

interface Member { id: string; name: string }
interface Category { id: string; name: string }
interface Expense {
  id: string; date: string; merchant: string; note: string; category: string; paidBy: string;
  currency: string; amount: string; lkrCents: number; bill: string;
}
interface Budget { id: string; category: string; limitCents: number; since: string; earlierCents: number }
interface Bill { id: string; name: string; merchant: string; amount: string; currency: string; date: string; category: string }
interface FormInit {
  amount: string; currency: string; date: string; merchant: string; category: string; paidBy: string; note: string; bill: string;
}

const ME = "Nadeesha Perera";
const THIS_MONTH = "2026-01";
const MONTHS = [
  { key: "2026-01", label: "January 2026" },
  { key: "2025-12", label: "December 2025" },
  { key: "2025-11", label: "November 2025" },
];
const MONTH_LABELS = MONTHS.map((m) => m.label);
const PREVIOUS: Record<string, string> = { "2026-01": "2025-12", "2025-12": "2025-11", "2025-11": "2025-10" };
const CURRENCIES = ["LKR", "USD", "EUR", "GBP", "INR", "AUD", "SGD", "AED"];
const RATES: Record<string, number> = { LKR: 1, USD: 300, EUR: 330, GBP: 385, INR: 3.6, AUD: 195, SGD: 225, AED: 82 };

const members: Member[] = [
  { id: "member.1", name: "Nadeesha Perera" },
  { id: "member.2", name: "Kasun Perera" },
];

const categories: Category[] = [
  { id: "cat.groceries", name: "Groceries" },
  { id: "cat.rent", name: "Rent" },
  { id: "cat.utilities", name: "Utilities" },
  { id: "cat.transport", name: "Transport" },
  { id: "cat.dining", name: "Dining out" },
  { id: "cat.health", name: "Health" },
  { id: "cat.entertainment", name: "Entertainment" },
  { id: "cat.other", name: "Other" },
];

const expenses: Expense[] = [
  { id: "exp-1", date: "2025-12-15", merchant: "Amazon", note: "Kitchen scale", category: "Other", paidBy: "Kasun Perera", currency: "USD", amount: "42.00", lkrCents: 1260000, bill: "amazon-order.png" },
  { id: "exp-2", date: "2025-12-28", merchant: "Ministry of Crab", note: "Anniversary dinner", category: "Dining out", paidBy: "Nadeesha Perera", currency: "LKR", amount: "21800.00", lkrCents: 2180000, bill: "" },
  { id: "exp-3", date: "2026-01-03", merchant: "Dialog", note: "Broadband", category: "Utilities", paidBy: "Nadeesha Perera", currency: "LKR", amount: "6900.00", lkrCents: 690000, bill: "dialog-jan.pdf" },
  { id: "exp-4", date: "2026-01-05", merchant: "Colombo Apartments", note: "January rent", category: "Rent", paidBy: "Kasun Perera", currency: "LKR", amount: "150000.00", lkrCents: 15000000, bill: "" },
  { id: "exp-5", date: "2026-01-10", merchant: "Uber", note: "Airport ride", category: "Transport", paidBy: "Kasun Perera", currency: "USD", amount: "18.50", lkrCents: 555000, bill: "" },
  { id: "exp-6", date: "2026-01-12", merchant: "Keells Super", note: "Weekly shopping", category: "Groceries", paidBy: "Nadeesha Perera", currency: "LKR", amount: "12500.00", lkrCents: 1250000, bill: "keells-0112.jpg" },
  { id: "exp-7", date: "2026-01-14", merchant: "Lanka Pharmacy", note: "Vitamins", category: "Health", paidBy: "Nadeesha Perera", currency: "LKR", amount: "4200.00", lkrCents: 420000, bill: "" },
];

const budgets: Budget[] = [
  { id: "budget-1", category: "Groceries", limitCents: 1500000, since: "2026-01", earlierCents: 1200000 },
  { id: "budget-2", category: "Utilities", limitCents: 1000000, since: "2025-12", earlierCents: 0 },
  { id: "budget-3", category: "Transport", limitCents: 500000, since: "2025-12", earlierCents: 0 },
  { id: "budget-4", category: "Dining out", limitCents: 2000000, since: "2025-12", earlierCents: 0 },
];

const bills: Bill[] = [
  { id: "bill-1", name: "keells-receipt.jpg", merchant: "Keells Super", amount: "8450.00", currency: "LKR", date: "2026-01-15", category: "Groceries" },
  { id: "bill-2", name: "uber-trip.png", merchant: "Uber", amount: "12.30", currency: "USD", date: "2026-01-14", category: "Transport" },
  { id: "bill-3", name: "cargills-bill.pdf", merchant: "Cargills Food City", amount: "3650.00", currency: "LKR", date: "2026-01-13", category: "Groceries" },
];

const user = { name: ME, email: "nadeesha@perera.example" };

function lkr(cents: number): string {
  const whole = String(Math.floor(cents / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const rest = String(cents % 100).padStart(2, "0");
  return `LKR ${whole}.${rest}`;
}

function left(cents: number): string {
  return cents < 0 ? `Over by ${lkr(-cents)}` : lkr(cents);
}

function bar(percent: number): string {
  const filled = Math.min(10, Math.round(percent / 10));
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

function keyOf(label: string): string {
  const found = MONTHS.find((m) => m.label === label);
  return found ? found.key : THIS_MONTH;
}

function sum(list: readonly Expense[]): number {
  return list.reduce((total, e) => total + e.lkrCents, 0);
}

function limitFor(b: Budget | undefined, month: string): number {
  if (!b) return 0;
  return month < b.since ? b.earlierCents : b.limitCents;
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <AppShell
      id="shell"
      user={user}
      nav={[
        { id: "nav.expenses", label: "Expenses", to: "screen.expenses" },
        { id: "nav.categories", label: "Categories", to: "screen.categories" },
        { id: "nav.budgets", label: "Budgets", to: "screen.budgets" },
        { id: "nav.reports", label: "Monthly report", to: "screen.reports" },
      ]}
      account="screen.account"
      signOut="screen.signed-out"
    >
      {children}
    </AppShell>
  );
}

function Expenses() {
  const state = useDisplayState();
  const all = useCollection<Expense>("expenses");
  const cats = useCollection<Category>("categories");
  const people = useCollection<Member>("members");
  const limits = useCollection<Budget>("budgets");
  const [monthLabel, setMonthLabel] = useState("January 2026");
  const [category, setCategory] = useState("All categories");
  const [payer, setPayer] = useState("Either partner");
  const [search, setSearch] = useState("");
  const key = keyOf(monthLabel);
  const text = search.trim().toLowerCase();
  const rows = (state === "state.empty" ? [] : all.items.slice())
    .filter((e) => e.date.startsWith(key))
    .filter((e) => category === "All categories" || e.category === category)
    .filter((e) => payer === "Either partner" || e.paidBy === payer)
    .filter((e) => text === "" || e.merchant.toLowerCase().includes(text) || e.note.toLowerCase().includes(text))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const budgetRows = cats.items
    .map((c) => {
      const limit = limitFor(limits.items.find((b) => b.category === c.name), key);
      const used = state === "state.empty" ? 0 : sum(all.items.filter((e) => e.category === c.name && e.date.startsWith(key)));
      return { id: c.id, name: c.name, limit, remaining: limit - used };
    })
    .filter((r) => r.limit > 0);
  const overallLimit = budgetRows.reduce((t, r) => t + r.limit, 0);
  const overallRemaining = budgetRows.reduce((t, r) => t + r.remaining, 0);
  return (
    <Shell>
      <Heading
        id="heading.expenses"
        text="Household expenses"
        actions={
          <Stack direction="row">
            <Button id="btn.upload-bill" label="Upload a bill" to="screen.bill-upload" />
            <Button id="btn.add-expense" label="Add expense" emphasis="primary" to="screen.expense-new" />
          </Stack>
        }
      />
      {state === "state.failed" && (
        <Alert id="alert.rates" tone="error" title="Exchange rates unavailable" text="Some LKR amounts are missing and are left out of the totals. Try again in a few minutes." />
      )}
      <StatGroup>
        <Stat id="stat.total" label={`Spent in ${monthLabel}`} value={lkr(sum(rows))} hint="all expenses shown below, in LKR" icon="Wallet" />
        {people.items.map((m) => (
          <Stat
            key={m.id}
            id={`stat.paid.${m.id}`}
            label={`Paid by ${m.name.split(" ")[0]}`}
            value={lkr(sum(rows.filter((e) => e.paidBy === m.name)))}
            hint="in LKR"
            icon="User"
          />
        ))}
        <Stat
          id="stat.budget-left"
          label="Budget remaining"
          value={left(overallRemaining)}
          hint={`of ${lkr(overallLimit)} across categories with a limit`}
          icon="Gauge"
          tone={overallRemaining < 0 ? "error" : "default"}
        />
      </StatGroup>
      <Section id="section.budget-left" title="Budget remaining" count={budgetRows.length} subtitle={`For ${monthLabel}, by category. Categories with no limit are not listed.`}>
        <Table
          id="table.budget-left"
          columns={["Category", { label: "Limit", kind: "number" }, { label: "Remaining", kind: "number" }, { label: "Status", kind: "status" }]}
          rows={budgetRows.map((r) => ({
            id: `budget-left.${r.id}`,
            cells: [r.name, lkr(r.limit), left(r.remaining)],
            status:
              r.remaining < 0
                ? { text: "Over budget", tone: "error" as const }
                : r.remaining * 100 < r.limit * 20
                  ? { text: "Over 80%", tone: "warning" as const }
                  : { text: "On track", tone: "success" as const },
            to: "screen.budgets",
          }))}
          empty={<EmptyState id="empty.budget-left" title="No budget limits" text="Set a limit on the Budgets screen to see what remains." actions={<Button id="btn.go-budgets" label="Open budgets" to="screen.budgets" />} />}
        />
      </Section>
      <Section id="section.expenses" title="Expenses" count={rows.length} subtitle="Newest first, 50 per page. You and your partner see the same list, and it refreshes when either of you adds one.">
        <Filters id="filters.expenses">
          <Field id="field.month" label="Month" type="select" options={MONTH_LABELS} value={monthLabel} onChange={setMonthLabel} />
          <Field id="field.category" label="Category" type="select" options={["All categories", ...cats.items.map((c) => c.name)]} value={category} onChange={setCategory} />
          <Field id="field.payer" label="Paid by" type="select" options={["Either partner", ...people.items.map((m) => m.name)]} value={payer} onChange={setPayer} />
          <Field id="field.search" label="Search merchant or note" type="text" value={search} onChange={setSearch} />
        </Filters>
        <Table
          id="table.expenses"
          columns={["Date", "Merchant", "Category", "Paid by", { label: "Paid amount", kind: "number" }, { label: "In LKR", kind: "number" }]}
          rows={rows.map((e) => ({
            id: `expense.${e.id}`,
            cells: [e.date, e.merchant, e.category, e.paidBy, `${e.currency} ${e.amount}`, lkr(e.lkrCents)],
            to: "screen.expense-detail",
            params: { expense: e.id },
          }))}
          empty={<EmptyState id="empty.expenses" title="No expenses match" text="Add an expense or change the filters." actions={<Button id="btn.empty-add" label="Add expense" emphasis="primary" to="screen.expense-new" />} />}
        />
      </Section>
    </Shell>
  );
}

function ExpenseDetail() {
  const { expense: id } = useParams();
  const navigate = useNav();
  const all = useCollection<Expense>("expenses");
  const [confirming, setConfirming] = useState(false);
  const expense = (id ? all.get(id) : undefined) ?? all.items[0];
  if (!expense) {
    return (
      <Shell>
        <Heading id="heading.detail" text="Expense" />
        <EmptyState id="empty.detail" title="No expenses yet" text="Add the first one." actions={<Button id="btn.detail-add" label="Add expense" emphasis="primary" to="screen.expense-new" />} />
      </Shell>
    );
  }
  return (
    <Shell>
      <Breadcrumbs
        id="crumbs.detail"
        items={[{ id: "crumb.expenses", label: "Expenses", to: "screen.expenses" }, { id: "crumb.expense", label: expense.merchant }]}
      />
      <Heading
        id="heading.detail"
        text={expense.merchant}
        actions={
          <Stack direction="row">
            <Button id="btn.edit" label="Edit" to="screen.expense-edit" params={{ expense: expense.id }} />
            <Button id="btn.delete" label="Delete" emphasis="danger" onPress={() => setConfirming(true)} />
          </Stack>
        }
      />
      <Detail
        id="detail.expense"
        fields={[
          { label: "Date", value: expense.date },
          { label: "Category", value: expense.category },
          { label: "Paid by", value: expense.paidBy },
          { label: "Paid amount", value: `${expense.currency} ${expense.amount}` },
          { label: "In LKR", value: lkr(expense.lkrCents) },
          { label: "Note", value: expense.note || "No note" },
          { label: "Bill", value: expense.bill || "No bill attached" },
        ]}
      />
      <Dialog
        id="dialog.delete"
        title="Delete this expense?"
        open={confirming}
        onClose={() => setConfirming(false)}
        actions={
          <Stack direction="row">
            <Button id="btn.delete-cancel" label="Keep it" onPress={() => setConfirming(false)} />
            <Button
              id="btn.delete-confirm"
              label="Delete for good"
              emphasis="danger"
              onPress={() => {
                all.remove(expense.id);
                setConfirming(false);
                navigate.go("screen.expenses");
              }}
            />
          </Stack>
        }
      >
        <Text id="text.delete" text="The expense and its bill are removed for both of you. This cannot be undone." />
      </Dialog>
    </Shell>
  );
}

function ExpenseForm(props: {
  heading: string;
  init: FormInit;
  editId?: string;
  banner?: ReactNode;
  submitLabel: string;
  cancelLabel: string;
}) {
  const state = useDisplayState();
  const navigate = useNav();
  const all = useCollection<Expense>("expenses");
  const cats = useCollection<Category>("categories");
  const people = useCollection<Member>("members");
  const knownBills = useCollection<Bill>("bills");
  const bad = state === "state.validation-error";
  const billOptions = ["No bill", ...knownBills.items.map((b) => b.name)];
  if (props.init.bill && !billOptions.includes(props.init.bill)) billOptions.push(props.init.bill);
  const save = (v: Record<string, string>) => {
    const amount = Number(v.amount ?? "0");
    const currency = v.currency ?? "LKR";
    const record = {
      date: v.date ?? "",
      merchant: v.merchant ?? "",
      note: v.note ?? "",
      category: v.category ?? "Other",
      paidBy: v.paidBy ?? ME,
      currency,
      amount: amount.toFixed(2),
      lkrCents: Math.round(amount * (RATES[currency] ?? 1) * 100),
      bill: v.bill === "No bill" ? "" : v.bill ?? "",
    };
    if (props.editId) all.update(props.editId, record);
    else all.create(record);
    navigate.go("screen.expenses");
  };
  return (
    <Shell>
      <Breadcrumbs
        id="crumbs.form"
        items={[{ id: "crumb.expenses", label: "Expenses", to: "screen.expenses" }, { id: "crumb.form", label: props.heading }]}
      />
      <Heading id="heading.form" text={props.heading} />
      {props.banner}
      {state === "state.failed" && (
        <Alert id="alert.save-failed" tone="error" title="The expense was not saved" text="The bill did not upload. Check your connection and save again." />
      )}
      {bad && <ValidationSummary id="summary.form" issues={["Enter the amount", "Choose the date of the expense"]} />}
      <Form
        id="form.expense"
        onSubmit={save}
        actions={
          <Stack direction="row">
            <Button id="btn.cancel" label={props.cancelLabel} to="screen.expenses" />
            <Button id="btn.save" label={props.submitLabel} emphasis="primary" submit />
          </Stack>
        }
      >
        <Field id="field.amount" name="amount" label="Amount" type="number" required defaultValue={props.init.amount} error={bad ? "Enter the amount" : undefined} />
        <Field id="field.currency" name="currency" label="Currency" type="select" options={CURRENCIES} defaultValue={props.init.currency} />
        <Field id="field.date" name="date" label="Date" type="date" required defaultValue={props.init.date} error={bad ? "Choose the date" : undefined} />
        <Field id="field.merchant" name="merchant" label="Merchant" type="text" defaultValue={props.init.merchant} />
        <Field id="field.category" name="category" label="Category" type="select" options={cats.items.map((c) => c.name)} defaultValue={props.init.category} />
        <Field id="field.paid-by" name="paidBy" label="Paid by" type="select" options={people.items.map((m) => m.name)} defaultValue={props.init.paidBy} />
        <Field id="field.note" name="note" label="Note" type="textarea" defaultValue={props.init.note} />
        <Field id="field.bill" name="bill" label="Bill (optional)" type="select" options={billOptions} defaultValue={props.init.bill || "No bill"} />
      </Form>
    </Shell>
  );
}

function ExpenseNew() {
  const all = useCollection<Expense>("expenses");
  const today = useToday();
  const last = all.items[all.items.length - 1];
  return (
    <ExpenseForm
      heading="Add expense"
      submitLabel="Save expense"
      cancelLabel="Cancel"
      init={{ amount: "", currency: last ? last.currency : "LKR", date: today, merchant: "", category: "Other", paidBy: ME, note: "", bill: "" }}
    />
  );
}

function ExpenseEdit() {
  const { expense: id } = useParams();
  const all = useCollection<Expense>("expenses");
  const today = useToday();
  const e = (id ? all.get(id) : undefined) ?? all.items[0];
  return (
    <ExpenseForm
      heading="Edit expense"
      submitLabel="Save changes"
      cancelLabel="Cancel"
      editId={e ? e.id : undefined}
      init={
        e
          ? { amount: e.amount, currency: e.currency, date: e.date, merchant: e.merchant, category: e.category, paidBy: e.paidBy, note: e.note, bill: e.bill }
          : { amount: "", currency: "LKR", date: today, merchant: "", category: "Other", paidBy: ME, note: "", bill: "" }
      }
    />
  );
}

function BillUpload() {
  const state = useDisplayState();
  const navigate = useNav();
  const known = useCollection<Bill>("bills");
  return (
    <Shell>
      <Breadcrumbs
        id="crumbs.upload"
        items={[{ id: "crumb.expenses", label: "Expenses", to: "screen.expenses" }, { id: "crumb.upload", label: "Upload a bill" }]}
      />
      <Heading id="heading.upload" text="Upload a bill" />
      {state === "state.delayed" && (
        <Alert id="alert.slow" tone="info" title="Reading the bill is taking longer than usual" text="Your values will appear for review as soon as the bill has been read." />
      )}
      <Form
        id="form.upload"
        title="Choose a bill"
        onSubmit={(v) => {
          const picked = known.items.find((b) => b.name === v.file);
          navigate.go("screen.bill-review", picked ? { bill: picked.id } : {});
        }}
        actions={
          <Stack direction="row">
            <Button id="btn.upload-cancel" label="Cancel" to="screen.expenses" />
            <Button id="btn.read-bill" label="Read bill" emphasis="primary" submit />
          </Stack>
        }
      >
        <Field
          id="field.file"
          name="file"
          label="Bill file (JPG, PNG or PDF, up to 5 MB)"
          type="select"
          options={known.items.map((b) => b.name)}
          required
          error={state === "state.validation-error" ? "Choose a JPG, PNG or PDF of up to 5 MB" : undefined}
        />
      </Form>
    </Shell>
  );
}

function BillReview() {
  const state = useDisplayState();
  const { bill: id } = useParams();
  const known = useCollection<Bill>("bills");
  const today = useToday();
  const b = (id ? known.get(id) : undefined) ?? known.items[0];
  const unreadable = state === "state.failed" || !b;
  const init: FormInit =
    unreadable || !b
      ? { amount: "", currency: "LKR", date: today, merchant: "", category: "Other", paidBy: ME, note: "", bill: b ? b.name : "" }
      : { amount: b.amount, currency: b.currency, date: b.date, merchant: b.merchant, category: b.category, paidBy: ME, note: "", bill: b.name };
  return (
    <ExpenseForm
      heading="Review bill"
      submitLabel="Confirm and save"
      cancelLabel="Discard upload"
      init={init}
      banner={
        unreadable ? (
          <Alert id="alert.unreadable" tone="warning" title="We could not read this bill" text="The bill stays attached. Fill in the expense yourself and save it." />
        ) : (
          <Alert id="alert.read" tone="info" title="Read from your bill" text="Check every value and correct anything wrong. Nothing is saved until you confirm." />
        )
      }
    />
  );
}

function Categories() {
  const state = useDisplayState();
  const cats = useCollection<Category>("categories");
  const spent = useCollection<Expense>("expenses");
  const [adding, setAdding] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dup, setDup] = useState(false);
  const taken = (name: string, except?: string) =>
    cats.items.some((c) => c.id !== except && c.name.toLowerCase() === name.trim().toLowerCase());
  const renamingCat = renaming ? cats.get(renaming) : undefined;
  const deletingCat = deleting ? cats.get(deleting) : undefined;
  const dupError = dup || state === "state.validation-error" ? "A category with this name already exists" : undefined;
  return (
    <Shell>
      <Heading id="heading.categories" text="Categories" />
      {state === "state.failed" && (
        <Alert id="alert.categories-failed" tone="error" title="The change was not saved" text="Try again in a moment." />
      )}
      <Section
        id="section.categories"
        title="Categories"
        count={cats.items.length}
        subtitle="Shared with your partner. Expenses with no category are kept under Other."
        actions={<Button id="btn.add-category" label="Add category" emphasis="primary" onPress={() => { setDup(false); setAdding(true); }} />}
      >
        <Table
          id="table.categories"
          columns={["Category", { label: "Expenses", kind: "number" }]}
          rows={cats.items.map((c) => ({
            id: `category.${c.id}`,
            cells: [c.name, String(spent.items.filter((e) => e.category === c.name).length)],
            actions: [
              { id: `category.${c.id}.rename`, label: "Rename", onPress: () => { setDup(false); setRenaming(c.id); } },
              ...(c.name === "Other"
                ? []
                : [{ id: `category.${c.id}.delete`, label: "Delete", emphasis: "danger" as const, onPress: () => setDeleting(c.id) }]),
            ],
          }))}
          empty={<EmptyState id="empty.categories" title="No categories" text="Add one to group your expenses." />}
        />
      </Section>
      {adding && (
        <Dialog id="dialog.add-category" title="Add category" open onClose={() => setAdding(false)}>
          <Form
            id="form.add-category"
            onSubmit={(v) => {
              const name = v.name ?? "";
              if (taken(name)) { setDup(true); return; }
              cats.create({ name: name.trim() });
              setAdding(false);
            }}
            actions={<Button id="btn.add-category-save" label="Add" emphasis="primary" submit />}
          >
            <Field id="field.category-name" name="name" label="Name" type="text" required error={dupError} />
          </Form>
        </Dialog>
      )}
      {renamingCat && (
        <Dialog id="dialog.rename-category" title={`Rename ${renamingCat.name}`} open onClose={() => setRenaming(null)}>
          <Form
            id="form.rename-category"
            onSubmit={(v) => {
              const name = v.name ?? "";
              if (taken(name, renamingCat.id)) { setDup(true); return; }
              spent.items.filter((e) => e.category === renamingCat.name).forEach((e) => spent.update(e.id, { category: name.trim() }));
              cats.update(renamingCat.id, { name: name.trim() });
              setRenaming(null);
            }}
            actions={<Button id="btn.rename-save" label="Rename" emphasis="primary" submit />}
          >
            <Field id="field.rename" name="name" label="Name" type="text" required defaultValue={renamingCat.name} error={dupError} />
          </Form>
        </Dialog>
      )}
      {deletingCat && (
        <Dialog
          id="dialog.delete-category"
          title={`Delete ${deletingCat.name}?`}
          open
          onClose={() => setDeleting(null)}
          actions={
            <Stack direction="row">
              <Button id="btn.delete-category-cancel" label="Keep it" onPress={() => setDeleting(null)} />
              <Button
                id="btn.delete-category-confirm"
                label="Delete"
                emphasis="danger"
                onPress={() => {
                  spent.items.filter((e) => e.category === deletingCat.name).forEach((e) => spent.update(e.id, { category: "Other" }));
                  cats.remove(deletingCat.id);
                  setDeleting(null);
                }}
              />
            </Stack>
          }
        >
          <Text id="text.delete-category" text="Its expenses move to Other. The expenses themselves are not deleted." />
        </Dialog>
      )}
    </Shell>
  );
}

function Reports() {
  const state = useDisplayState();
  const all = useCollection<Expense>("expenses");
  const [label, setLabel] = useState("January 2026");
  const key = keyOf(label);
  const inMonth = (k: string) => (state === "state.empty" ? [] : all.items.filter((e) => e.date.startsWith(k)));
  const current = inMonth(key);
  const previousKey = PREVIOUS[key] ?? "";
  const previousLabel = (MONTHS.find((m) => m.key === previousKey) ?? { label: "the month before" }).label;
  const days = Array.from(new Set(current.map((e) => e.date))).sort();
  const perDay = days.map((d) => ({ day: d, total: sum(current.filter((e) => e.date === d)) }));
  const most = perDay.reduce((m, d) => Math.max(m, d.total), 0);
  return (
    <Shell>
      <Heading id="heading.reports" text="Monthly report" />
      {state === "state.failed" && (
        <Alert id="alert.report-failed" tone="error" title="Exchange rates unavailable" text="Totals leave out expenses whose LKR amount could not be worked out." />
      )}
      <Filters id="filters.report">
        <Field id="field.report-month" label="Month" type="select" options={MONTH_LABELS} value={label} onChange={setLabel} />
      </Filters>
      <StatGroup>
        <Stat id="stat.month-total" label={`Spent in ${label}`} value={lkr(sum(current))} hint="every expense, in LKR" icon="ChartColumn" />
        <Stat id="stat.previous-total" label={`Spent in ${previousLabel}`} value={lkr(sum(inMonth(previousKey)))} hint="the month before, for comparison" icon="CalendarDays" />
      </StatGroup>
      <Section id="section.per-day" title="Spending per day" count={perDay.length} subtitle="One bar per day with expenses.">
        <Table
          id="table.per-day"
          columns={["Day", { label: "Spent (LKR)", kind: "number" }, "Chart"]}
          rows={perDay.map((d) => ({
            id: `day.${d.day}`,
            cells: [d.day, lkr(d.total), bar(most > 0 ? Math.round((d.total * 100) / most) : 0)],
          }))}
          empty={<EmptyState id="empty.report" title="No expenses in this month" text="The total for this month is LKR 0.00." />}
        />
      </Section>
    </Shell>
  );
}

function Budgets() {
  const state = useDisplayState();
  const cats = useCollection<Category>("categories");
  const spent = useCollection<Expense>("expenses");
  const limits = useCollection<Budget>("budgets");
  const [label, setLabel] = useState("January 2026");
  const [editing, setEditing] = useState<string | null>(null);
  const key = keyOf(label);
  const change = (category: string, cents: number) => {
    const existing = limits.items.find((b) => b.category === category);
    if (existing) {
      limits.update(existing.id, {
        earlierCents: existing.since < THIS_MONTH ? existing.limitCents : existing.earlierCents,
        limitCents: cents,
        since: THIS_MONTH,
      });
    } else if (cents > 0) {
      limits.create({ category, limitCents: cents, since: THIS_MONTH, earlierCents: 0 });
    }
  };
  const editingBudget = editing ? limits.items.find((b) => b.category === editing) : undefined;
  return (
    <Shell>
      <Heading id="heading.budgets" text="Budgets" />
      <Alert id="alert.budget-rule" tone="info" text="A limit repeats every month. A changed limit applies from January 2026 on; earlier months keep the limit they had. All amounts are in LKR." />
      <Filters id="filters.budgets">
        <Field id="field.budget-month" label="Month" type="select" options={MONTH_LABELS} value={label} onChange={setLabel} />
      </Filters>
      <Section id="section.budgets" title="Spending against limits" count={cats.items.length} subtitle="Highlighted when a category passes 80% of its limit, and again past 100%.">
        <Table
          id="table.budgets"
          columns={["Category", { label: "Limit", kind: "number" }, { label: "Spent", kind: "number" }, "Progress", { label: "Status", kind: "status" }]}
          rows={cats.items.map((c) => {
            const limit = limitFor(limits.items.find((b) => b.category === c.name), key);
            const used = state === "state.empty" ? 0 : sum(spent.items.filter((e) => e.category === c.name && e.date.startsWith(key)));
            const percent = limit > 0 ? Math.round((used * 100) / limit) : 0;
            const status =
              limit === 0
                ? undefined
                : percent > 100
                  ? { text: "Over budget", tone: "error" as const }
                  : percent > 80
                    ? { text: "Over 80%", tone: "warning" as const }
                    : { text: "On track", tone: "success" as const };
            return {
              id: `budget.${c.id}`,
              cells: [c.name, limit > 0 ? lkr(limit) : "No limit", lkr(used), limit > 0 ? `${bar(percent)} ${percent}%` : "No bar without a limit"],
              status,
              actions: [
                { id: `budget.${c.id}.set`, label: limit > 0 ? "Change limit" : "Set limit", onPress: () => setEditing(c.name) },
                ...(limit > 0 ? [{ id: `budget.${c.id}.remove`, label: "Remove limit", emphasis: "danger" as const, onPress: () => change(c.name, 0) }] : []),
              ],
            };
          })}
          empty={<EmptyState id="empty.budgets" title="No categories" text="Add a category first." />}
        />
      </Section>
      {editing && (
        <Dialog id="dialog.limit" title={`Monthly limit for ${editing}`} open onClose={() => setEditing(null)}>
          <Form
            id="form.limit"
            onSubmit={(v) => {
              change(editing, Math.round(Number(v.limit ?? "0") * 100));
              setEditing(null);
            }}
            actions={<Button id="btn.limit-save" label="Save limit" emphasis="primary" submit />}
          >
            <Field
              id="field.limit"
              name="limit"
              label="Monthly limit (LKR)"
              type="number"
              required
              defaultValue={editingBudget ? String(editingBudget.limitCents / 100) : ""}
              error={state === "state.validation-error" ? "Enter a limit above zero" : undefined}
            />
          </Form>
        </Dialog>
      )}
    </Shell>
  );
}

function Account() {
  return (
    <Shell>
      <Heading id="heading.account" text="Account" />
      <Detail id="detail.account" fields={[{ label: "Name", value: user.name }, { label: "Email", value: user.email }, { label: "Household", value: "Perera household" }]} />
    </Shell>
  );
}

function SignedOut() {
  return (
    <Screen>
      <Heading id="heading.signed-out" text="You are signed out" />
      <Button id="btn.sign-in" label="Sign in" emphasis="primary" to="screen.expenses" />
    </Screen>
  );
}

export default defineApp({
  screens: {
    "screen.expenses": Expenses,
    "screen.expense-detail": ExpenseDetail,
    "screen.expense-new": ExpenseNew,
    "screen.expense-edit": ExpenseEdit,
    "screen.bill-upload": BillUpload,
    "screen.bill-review": BillReview,
    "screen.categories": Categories,
    "screen.budgets": Budgets,
    "screen.reports": Reports,
    "screen.account": Account,
    "screen.signed-out": SignedOut,
  },
  data: { members, categories, expenses, budgets, bills },
});
