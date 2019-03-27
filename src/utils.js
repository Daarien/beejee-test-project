import md5 from 'md5';

const url = 'https://uxcandy.com/~shapoval/test-task-backend/';
const dev = 'developer=SergMatv';

export async function get(query) {
    const req = query
        ? String(url + '?' + query + '&' + dev)
        : String(url + '?' + dev);

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
    const status_key = fixedEncodeURIComponent('status');
    const status = fixedEncodeURIComponent(formData.get('status'));
    const text_key = fixedEncodeURIComponent('text');
    const text = fixedEncodeURIComponent(formData.get('text'));
    const token_key = fixedEncodeURIComponent('token');
    const token = fixedEncodeURIComponent('beejee');

    const params_string = `${status_key}=${status}&${text_key}=${text}&${token_key}=${token}`;

    const signature = md5(params_string);

    formData.append('signature', signature);

    return await fetch(req, {
        method: 'POST',
        body: formData,
    })
        .then(res => res.json())
        .catch(error => console.error(error));
}

function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}