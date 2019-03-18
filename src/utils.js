import md5 from 'md5';

const url = 'https://uxcandy.com/~shapoval/test-task-backend/';
const dev = 'developer=SergMatv';

export async function get(query) {
    const req = query
        ? String(url + '?' + query + '&' + dev)
        : String(url + '?' + dev);
    console.log('TCL: get -> req', req)
    return await fetch(req)
        .then(res => res.json())
        .catch(error => console.error(error));
}

export async function create(formData) {
    const req = String(url + 'create?' + dev);
    return await fetch(req, {
        method: 'POST',
        body: formData,
    })
        .then(res => res.json())
        .catch(error => console.error(error));
}

export async function edit(id, formData) {
    const req = String(url + `edit/${id}?` + dev);
    console.log('TCL: edit -> req', req);

    const text = encodeURIComponent(formData.get('text'));
    const status = encodeURIComponent(formData.get('status'));

    const params_string = `status=${status}&text=${text}&token=beejee`;
    console.log('TCL: edit -> params_string', params_string);

    const signature = md5(params_string);
    console.log('TCL: edit -> signature', signature);

    formData.append('signature', signature);

    return await fetch(req, {
        method: 'POST',
        body: formData,
    })
        .then(res => res.json())
        .catch(error => console.error(error));
}