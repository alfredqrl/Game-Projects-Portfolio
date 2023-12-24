using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Enemy : MonoBehaviour
{
    // Start is called before the first frame update
    public float speed;
    private Rigidbody rb;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }
    void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            Debug.LogFormat("Enter: {0}", collision.gameObject.name);
            Debug.Log("Game Over!");
            //add more details
        }
        //if (collision.gameObject.name != "Plane")
        //{
        //    Debug.Log("Enter: " + collision.gameObject.name);
        //}
    }

    // Update is called once per frame
    void Update()
    {
        
        Vector3 direction = Vector3.zero;
        if (Input.GetKey(KeyCode.UpArrow))
        {
            direction += transform.forward;
        }
        if (Input.GetKey(KeyCode.DownArrow))
        {
            direction -= transform.forward;
        }
        if (Input.GetKey(KeyCode.RightArrow))
        {
            direction += transform.right;
        }
        if (Input.GetKey(KeyCode.LeftArrow))
        {
            direction -= transform.right;
        }
        rb.velocity = direction * speed;

        //if (Input.GetKey(KeyCode.UpArrow))
        //{
        //    transform.position = Vector3.Lerp(transform.position, transform.position + transform.forward, speed * Time.deltaTime);

        //}
        //if (Input.GetKey(KeyCode.DownArrow))
        //{
        //    transform.position = Vector3.Lerp(transform.position, transform.position - transform.forward, speed * Time.deltaTime);

        //}
        //if (Input.GetKey(KeyCode.RightArrow))
        //{
        //    transform.position = Vector3.Lerp(transform.position, transform.position + transform.right, speed * Time.deltaTime);

        //}
        //if (Input.GetKey(KeyCode.LeftArrow))
        //{
        //    transform.position = Vector3.Lerp(transform.position, transform.position - transform.right, speed * Time.deltaTime);

        //}
    }
}
