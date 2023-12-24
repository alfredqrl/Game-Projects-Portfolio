using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Unity.Netcode;
using Random = UnityEngine.Random;
using UnityEngine.SceneManagement;

public class Player : NetworkBehaviour
{
    // Start is called before the first frame update
    public float speed;
    private Rigidbody rb;//a reference to the rigidbody component

    void Start()
    {
        if (!IsOwner)
        {
            this.gameObject.GetComponentInChildren<Camera>().enabled = false;
            Transform CardboardMain = transform.GetChild(0);
            Transform Head = CardboardMain.GetChild(0);
            Transform Camera = Head.GetChild(0);
            
            
            Camera.GetComponentsInChildren<Camera>()[0].enabled = false;
            Camera.GetComponentsInChildren<Camera>()[1].enabled = false;

            // Transform CameraLeft = Camera.GetChild(0);
            // Transform CameraRight = Camera.GetChild(1);
            // CameraLeft.gameObject.GetComponent<Camera>().enable = false;
            // CameraRight.GetComponent<Camera>().enable = false;
            // Debug.Log(CameraLeft.name);
            // Debug.Log(CameraRight.name); 
            // Transform Head = this.gameObject.GetComponentsInChildren<Camera>();
            // Transform Head = transform.GetChild(0);
            // Debug.Log(Head.name);            
            // Camera camera_left = Head.GetComponentInChildren<Camera>();
            // Camera camera_right = Head.GetChild(0).GetComponentInChildren<Camera>(); 
            //Head.enabled = false;
            // camera_left.enabled = false;
            // camera_right.enabled = false;
        }
        rb = GetComponent<Rigidbody>();

        transform.position = new Vector3(Random.Range(-40,40f), 1, Random.Range(-40,40f));
    }

    void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            Debug.LogFormat("Enter: {0}", collision.gameObject.name);
            Debug.Log("Game Over");
            SceneManager.LoadScene("EndingCat");
        }
    }

    // Update is called once per frame
    void Update()
    {
        Vector3 direction = Vector3.zero;
        if (Input.GetKey(KeyCode.W))
        {
            direction += transform.forward;
        }
        if (Input.GetKey(KeyCode.S))
        {
            direction -= transform.forward;
        }
        if (Input.GetKey(KeyCode.D))
        {
            direction += transform.right;
        }
        if (Input.GetKey(KeyCode.A))
        {
            direction -= transform.right;
        }
        rb.velocity = direction * speed;
        //if (Input.GetKey(KeyCode.W))
        //{
        //    transform.position = Vector3.Lerp(transform.position, transform.position + transform.forward, speed * Time.deltaTime);

        //}
        //if (Input.GetKey(KeyCode.S))
        //{
        //    transform.position = Vector3.Lerp(transform.position, transform.position - transform.forward, speed * Time.deltaTime);

        //}
        //if (Input.GetKey(KeyCode.D))
        //{
        //    transform.position = Vector3.Lerp(transform.position, transform.position + transform.right, speed * Time.deltaTime);

        //}
        //if (Input.GetKey(KeyCode.A))
        //{
        //    transform.position = Vector3.Lerp(transform.position, transform.position - transform.right, speed * Time.deltaTime);

        //}
    }

}
