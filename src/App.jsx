import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.jsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    const res = await fetch("https://kvdb.io/BLbtbuWvN1B5uCxdV8Nzk6/jobs:");
    const data = await res.json();
    setJobs(Object.values(data));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const job = { title, description, url };
    let path = "jobs:";
    if (editId !== null) {
      path += editId;
    }
    await fetch(`https://kvdb.io/BLbtbuWvN1B5uCxdV8Nzk6/${path}`, {
      method: editId !== null ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    setOpen(false);
    setTitle("");
    setDescription("");
    setUrl("");
    setEditId(null);
    fetchJobs();
  }

  function handleEdit(id) {
    const job = jobs.find((j) => j.key === id);
    setTitle(job.title);
    setDescription(job.description);
    setUrl(job.url);
    setEditId(id);
    setOpen(true);
  }

  async function handleDelete(id) {
    await fetch(`https://kvdb.io/BLbtbuWvN1B5uCxdV8Nzk6/jobs:${id}`, {
      method: "DELETE",
    });
    fetchJobs();
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>AI Jobs Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Add Job</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Job</DialogTitle>
                  <DialogDescription>Enter the job details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input id="title" value={title} className="col-span-3" onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea id="description" value={description} className="col-span-3" onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="url" className="text-right">
                        URL
                      </Label>
                      <Input id="url" value={url} className="col-span-3" onChange={(e) => setUrl(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableCaption>AI Jobs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.key}>
                  <TableCell className="font-medium">
                    <img src={`https://source.unsplash.com/random/100x100/?portrait%20professional`} alt="Job" />
                  </TableCell>
                  <TableCell className="font-medium">
                    <a href={job.url} target="_blank">
                      {job.title}
                    </a>
                  </TableCell>
                  <TableCell>{job.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" className="mr-2" onClick={() => handleEdit(job.key)}>
                      Edit
                    </Button>
                    <Button variant="outline" onClick={() => handleDelete(job.key)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
